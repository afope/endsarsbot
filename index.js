const Twit = require('twit');
require("dotenv").config();

console.log('consumer', process.env.CONSUMER_KEY)

const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET_KEY,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET_KEY
});


const userID = ['957547182', '2964950313', '3440200642', '727803307880796160', '470130723', '198084264', '2914442873', '2845191549'];

const stream = T.stream('statuses/filter', {
        follow: userID
        // track: ['EndSars', 'SARS']
});

// event handler
function from_creator (tweet) {
    const userId = tweet.user.id;
    const userIDToString = userId.toString();

    if (tweet.in_reply_to_status_id != null) {
        return false;
    }
    else if (tweet.in_reply_to_screen_name != null) {
        return false;
    }
    else if (tweet.in_reply_to_user_id != null) {
        return false;
    }
    else if (!userID.includes(userIDToString)) {
        return false;
    }
    else {
        return true;
    }

}

function reply (tweet) {
    var res = {
        status: `@${tweet.user.screen_name} #ENDSARS #ENDSARSNOW!!!!!!!`,
        in_reply_to_status_id: '' + tweet.id_str
    };

    console.log('res', res);

    T.post('statuses/update', res,
        function(err, data, response) {
            console.log(data);
        }
        );
}

stream.on('tweet', tweet => {
    if (from_creator(tweet)) {
        console.log('tweet', tweet);
        reply(tweet);
    }
});
