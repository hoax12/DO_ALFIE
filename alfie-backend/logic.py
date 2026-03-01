import json

def successor_unlocker(matrix, edges):
    """
    Checks the graph and unlocks nodes when prerequisites are MASTERED.
    """
    new_matrix = matrix.copy()
    unlocked_any = False
    
    for node_id, status in matrix.items():
        if status == "LOCKED":
            # Find prerequisites for this specific node
            prereqs = [e['source'] for e in edges if e['target'] == node_id and e['relationship'] == 'prerequisite']
            
            # Logic: If all prereqs are MASTERED, unlock the node
            if prereqs and all(matrix.get(p) == "MASTERED" for p in prereqs):
                new_matrix[node_id] = "NEEDS_REVIEW"
                unlocked_any = True
                print(f"🔓 Node {node_id} is now UNLOCKED!")
                
    return new_matrix, unlocked_any

# Example Test Case
if __name__ == "__main__":
    current_matrix = {"2.5": "MASTERED", "5.1": "LOCKED"}
    sample_edges = [{"source": "2.5", "target": "5.1", "relationship": "prerequisite"}]
    
    updated, changed = successor_unlocker(current_matrix, sample_edges)
    print("Updated Matrix:", updated)