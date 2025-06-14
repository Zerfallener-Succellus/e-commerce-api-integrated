import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

import '../providers/cart_provider.dart';

class ApiService {
  static const String _ip = 'localhost';
  static const String _baseUrl = 'http://$_ip:3000';

  static Future<List<Product>> getProducts(
      {Map<String, dynamic>? filters}) async {
    try {
      final queryParams = filters?.entries
          .where((entry) =>
              entry.value != null && entry.value.toString().isNotEmpty)
          .map((entry) =>
              '${entry.key}=${Uri.encodeComponent(entry.value.toString())}')
          .join('&');

      final url = Uri.parse(
          '$_baseUrl/products${queryParams != null && queryParams.isNotEmpty ? '?$queryParams' : ''}');

      if (kDebugMode) {
        print('Tentando conectar em: $url');
      }

      final response = await http.get(
        url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      ).timeout(const Duration(seconds: 5));

      if (kDebugMode) {
        print('Resposta do servidor:');
        print('Status: ${response.statusCode}');
        print('Body: ${response.body}');
      }

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);

        final products = data
            .map((json) => Product(
                  id: json['id'],
                  name: json['name'],
                  description: json['description'],
                  price: json['price'].toDouble(),
                  imageUrl: json['imageUrl'],
                  origin: json['origin'],
                ))
            .toList();

        if (kDebugMode) {
          print('Produtos carregados com sucesso: ${products.length}');
        }
        return products;
      } else {
        throw Exception(
            'Falha ao carregar produtos. Status: ${response.statusCode}');
      }
    } catch (e) {
      if (kDebugMode) {
        print('Erro ao buscar produtos: $e');
      }
      throw Exception('Não foi possível conectar ao servidor: $e');
    }
  }

  static Future<Map<String, dynamic>> createOrder(
      List<Map<String, dynamic>> items) async {
    try {
      final url = Uri.parse('$_baseUrl/orders');

      if (kDebugMode) {
        print('Criando pedido em: $url');
        print('Items: $items');
      }

      final response = await http
          .post(
            url,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: json.encode({'items': items}),
          )
          .timeout(const Duration(seconds: 10));

      if (kDebugMode) {
        print('Resposta do servidor:');
        print('Status: ${response.statusCode}');
        print('Body: ${response.body}');
      }

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        if (kDebugMode) {
          print('Pedido criado com sucesso: ${data['id']}');
        }
        return data;
      } else {
        throw Exception(
            'Falha ao criar pedido. Status: ${response.statusCode}');
      }
    } catch (e) {
      if (kDebugMode) {
        print('Erro ao criar pedido: $e');
      }
      throw Exception('Não foi possível conectar ao servidor: $e');
    }
  }
}
