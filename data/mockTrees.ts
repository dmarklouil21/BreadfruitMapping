import { Tree } from '../types';  // Direct file reference

export const mockTrees: Tree[] = [
    {
        id: '1',
        location: 'Argao',
        diameter: 0.45,
        dateTracked: '2024-01-10',
        fruitStatus: 'ripe',
        coordinates: { latitude: 9.8814, longitude: 123.6086 },
        // image: 'https://example.com/image1.jpg'
    }, 
    {
        id: '2',
        location: 'Sibonga',
        diameter: 0.50,
        dateTracked: '2024-02-05',
        fruitStatus: 'unripe',
        coordinates: { latitude: 10.0172, longitude: 123.6207 },
        // image: 'https://example.com/image1.jpg'
    },
    {
        id: '3',
        location: 'Dalaguete',
        diameter: 0.40,
        dateTracked: '2024-03-01',
        fruitStatus: 'none',
        coordinates: { latitude: 9.7619, longitude: 123.5330 },
        // image: 'https://example.com/image1.jpg'
    },
    {
        id: '4',
        location: 'Boljoon',
        diameter: 0.55,
        dateTracked: '2024-04-15',
        fruitStatus: 'ripe',
        coordinates: { latitude: 9.6286, longitude: 123.4802 },
        // image: 'https://example.com/image1.jpg'
    },
];