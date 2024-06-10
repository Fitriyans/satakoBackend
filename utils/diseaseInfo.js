function getDiseaseInfo(classIndex) {
    const diseases = [
        {
            name: 'Disease 1',
            description: 'Description for Disease 1',
            causes: 'Causes for Disease 1',
            solutions: 'Solution for Disease 1'
        },
        {
            name: 'Disease 2',
            description: 'Description for Disease 2',
            causes: 'Causes for Disease 2',
            solutions: 'Solution for Disease 2'
        }
        // Add more diseases as needed
    ];
    return diseases[classIndex];
}

module.exports = getDiseaseInfo;
