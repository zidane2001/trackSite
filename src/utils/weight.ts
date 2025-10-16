export interface PackageInput {
    weightKg: number;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    quantity: number;
}

export function calculateVolumetricWeightKg(lengthCm: number, widthCm: number, heightCm: number, divisor = 5000): number {
    const volumeCm3 = lengthCm * widthCm * heightCm;
    const volumetricKg = volumeCm3 / divisor;
    return parseFloat(volumetricKg.toFixed(3));
}

export function calculateShipmentWeights(packages: PackageInput[], divisor = 5000): {
    actualWeightKg: number;
    volumetricWeightKg: number;
    taxedWeightKg: number;
} {
    let actual = 0;
    let volumetric = 0;
    for (const pkg of packages) {
        const qty = Math.max(1, pkg.quantity || 1);
        actual += (pkg.weightKg || 0) * qty;
        const v = calculateVolumetricWeightKg(pkg.lengthCm || 0, pkg.widthCm || 0, pkg.heightCm || 0, divisor);
        volumetric += v * qty;
    }
    const taxed = Math.max(actual, volumetric);
    return {
        actualWeightKg: parseFloat(actual.toFixed(3)),
        volumetricWeightKg: parseFloat(volumetric.toFixed(3)),
        taxedWeightKg: parseFloat(taxed.toFixed(3))
    };
}


