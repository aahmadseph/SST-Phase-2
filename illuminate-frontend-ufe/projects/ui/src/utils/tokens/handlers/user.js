import userUtils from 'utils/User';

export default {
    process(value) {
        if (userUtils.isAnonymous()) {
            return Promise.reject(new Error('User not identified'));
        }

        return userUtils.getUser().then(user => {
            if (value in user) {
                return user[value];
            }

            if ('fullName' === value) {
                return `${user['firstName']} ${user['lastName']}`;
            }

            return value;
        });
    }
};
