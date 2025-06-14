import 'package:flutter/material.dart';

class FilterPanel extends StatefulWidget {
  final Function(Map<String, dynamic>) onApplyFilters;

  const FilterPanel({
    super.key,
    required this.onApplyFilters,
  });

  @override
  State<FilterPanel> createState() => _FilterPanelState();
}

class _FilterPanelState extends State<FilterPanel> {
  String _selectedOrigin = '';
  RangeValues _priceRange = const RangeValues(0, 1000);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Filtros',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            'Origem',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: [
              FilterChip(
                label: const Text('Brasil'),
                selected: _selectedOrigin == 'Brasil',
                onSelected: (selected) {
                  setState(() {
                    _selectedOrigin = selected ? 'Brasil' : '';
                  });
                },
              ),
              FilterChip(
                label: const Text('Europa'),
                selected: _selectedOrigin == 'Europa',
                onSelected: (selected) {
                  setState(() {
                    _selectedOrigin = selected ? 'Europa' : '';
                  });
                },
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            'Preço',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          RangeSlider(
            values: _priceRange,
            min: 0,
            max: 1000,
            divisions: 20,
            labels: RangeLabels(
              'R\$ ${_priceRange.start.round()}',
              'R\$ ${_priceRange.end.round()}',
            ),
            onChanged: (values) {
              setState(() {
                _priceRange = values;
              });
            },
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                final filters = {
                  if (_selectedOrigin.isNotEmpty) 'origin': _selectedOrigin,
                  'minPrice': _priceRange.start,
                  'maxPrice': _priceRange.end,
                };
                widget.onApplyFilters(filters);
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Aplicar Filtros'),
            ),
          ),
        ],
      ),
    );
  }
} 