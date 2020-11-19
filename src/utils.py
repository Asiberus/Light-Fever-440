def mapRange(old_range, new_range, value):
    old_min, old_max = old_range
    new_min, new_max = new_range
    old_range_difference = old_max - old_min
    new_range_difference = new_max - new_min

    new_value = (((value - old_min) * new_range_difference) / old_range_difference) + new_min

    return new_value    
