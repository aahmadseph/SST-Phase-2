export default function getResource(label, vars = []) {
    const resources = {
        post: 'post',
        posts: 'posts',
        group: 'group',
        groups: 'groups',
        photo: 'photo',
        photos: 'photos',
        review: 'review',
        reviews: 'reviews'
    };
    return resources[label];
}
