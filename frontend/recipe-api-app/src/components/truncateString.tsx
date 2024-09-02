export const truncateString = (label: string, maxLength: number) => {
    if (label.length <= maxLength) {
        return label;
    }
    
    const truncatedLabel = label.substring(0, maxLength);
    const lastSpaceIndex = truncatedLabel.lastIndexOf(' ');
    
    if (lastSpaceIndex !== -1) {
        return truncatedLabel.substring(0, lastSpaceIndex) + '...';
    } else {
        return truncatedLabel + '...';
    }
};