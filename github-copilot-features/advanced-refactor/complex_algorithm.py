# An inefficient implementation of a data processing algorithm
# This code contains performance bottlenecks and inefficient data structures
# that can be optimized with GitHub Copilot's assistance

def process_large_dataset(data, threshold=0.5):
    """
    Process a large dataset with an inefficient algorithm.
    This function has several performance issues:
    - Redundant calculations
    - Inefficient data structures
    - Unnecessary copying of data
    - Poor algorithm choice
    
    Parameters:
    - data: List of dictionaries with 'id', 'value', and 'metadata' fields
    - threshold: Threshold value for filtering
    
    Returns:
    - Processed and filtered data
    """
    # Initialize results
    results = []
    
    # Pre-process: extract values for later use
    all_values = []
    for item in data:
        all_values.append(item['value'])
    
    # Calculate statistics - inefficiently
    total = 0
    for val in all_values:
        total += val
    mean = total / len(all_values) if len(all_values) > 0 else 0
    
    # Calculate variance - inefficiently
    variance = 0
    for val in all_values:
        variance += (val - mean) ** 2
    variance = variance / len(all_values) if len(all_values) > 0 else 0
    
    # Process each item - with redundant calculations
    for item in data:
        # Normalize value - redundantly calculated for each item
        normalized_value = (item['value'] - mean) / (variance ** 0.5) if variance > 0 else 0
        
        # Filter based on threshold
        if normalized_value > threshold:
            # Deep copy the item to avoid modifying original data
            processed_item = {}
            for key in item:
                processed_item[key] = item[key]
            
            # Add derived fields
            processed_item['normalized_value'] = normalized_value
            processed_item['is_significant'] = normalized_value > 2 * threshold
            
            # Add to results
            results.append(processed_item)
    
    # Sort results - inefficiently
    for i in range(len(results)):
        for j in range(i + 1, len(results)):
            if results[i]['normalized_value'] < results[j]['normalized_value']:
                results[i], results[j] = results[j], results[i]
    
    # Calculate additional metrics for filtered items - redundant loops
    metadata_counts = {}
    for item in results:
        meta = item['metadata']
        if meta in metadata_counts:
            metadata_counts[meta] = metadata_counts[meta] + 1
        else:
            metadata_counts[meta] = 1
    
    # Add frequency information to results - another loop through results
    for item in results:
        item['frequency'] = metadata_counts[item['metadata']] / len(results) if len(results) > 0 else 0
    
    return results


def generate_test_data(size=1000):
    """
    Generate test data for demonstration.
    """
    import random
    data = []
    for i in range(size):
        data.append({
            'id': i,
            'value': random.random() * 100,
            'metadata': random.choice(['A', 'B', 'C', 'D', 'E'])
        })
    return data


# Example usage
if __name__ == "__main__":
    # Generate sample data
    test_data = generate_test_data(size=5000)
    
    # Time the processing
    import time
    start_time = time.time()
    
    # Process data
    result = process_large_dataset(test_data)
    
    # Print execution time
    print(f"Processed {len(test_data)} items in {time.time() - start_time:.4f} seconds")
    print(f"Result contains {len(result)} items")
    
    # Print first few results
    for i, item in enumerate(result[:5]):
        print(f"{i+1}. ID: {item['id']}, Value: {item['value']:.2f}, Normalized: {item['normalized_value']:.2f}")