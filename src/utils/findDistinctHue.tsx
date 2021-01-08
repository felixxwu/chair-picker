function findDistinctHue(hues: number[]) {
    if (hues.length === 0) return Math.random() * 360
    if (hues.length === 1) return (hues[0] + 180) % 360
    const sorted = hues.sort((a, b) => a < b ? -1 : 1)
    const pairs = sorted.map((hue, index) => [hue, sorted[(index + 1) % sorted.length]])
    const distances = pairs.map(pair => ({dist: ((pair[1] - pair[0] + 360) % 360), from: pair[0]}))
    const sortedDistances = distances.sort((a, b) => a.dist < b.dist ? 1 : -1)
    const largestDistance = sortedDistances[0]
    const distinctHue = (largestDistance.from + largestDistance.dist / 2) % 360
    return distinctHue
}

export default findDistinctHue
