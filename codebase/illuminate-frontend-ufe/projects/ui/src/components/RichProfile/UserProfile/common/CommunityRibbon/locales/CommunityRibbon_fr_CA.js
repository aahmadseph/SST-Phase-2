export default function getResource(label, vars = []) {
    const resources = {
        post: 'publication',
        posts: 'publications',
        group: 'groupe',
        groups: 'groupes',
        photo: 'photo',
        photos: 'photos',
        review: 'commentaire',
        reviews: 'commentaires'
    };
    return resources[label];
}
