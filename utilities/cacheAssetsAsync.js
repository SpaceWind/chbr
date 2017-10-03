import { Image } from 'react-native';


export default function cacheAssetsAsync({ images = [], fonts = [] }) {
    return Promise.all(cacheImages(images));
}

function cacheImages(images) {
    return images.map(image => {
        if (typeof image === 'string') {
            return Image.prefetch(image);
        }
    });
}
