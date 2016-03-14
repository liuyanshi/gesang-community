var Reply      = require('../../models/index').Reply;
var EventProxy = require('eventproxy');
var User       = require('./../user/user');
var markdown   = require('markdown').markdown;

/**
 * 根据文章ID获得回复
 * @param article_id
 * @param callback
 */
exports.getRepliesByArticleId = function (article_id, callback) {

    Reply.find({article_id: article_id, deleted: false}, '', {sort: 'create_at'}, function (err, replies) {
        if (err) return callback(err);
        if (replies.length === 0) return callback(null, []);
        var ep = new EventProxy();
        ep.after('reply_find', replies.length, function () {
            callback(null, replies);
        });

        for (var j = 0; j < replies.length; j++) {
            (function (i) {
                var author_id = replies[i].author_id;
                User.getUserById(author_id, function (err, author) {
                    if (err) return callback(err);
                    replies[i].author  = author || {_id: ''};
                    replies[i].content = markdown.toHTML(replies[i].content);
                    ep.emit('reply_find');
                });
            })(j);
        }
    });
};

/**
 * 保存新的文章回复
 * @param author_id     回复者ID
 * @param article_id    文章ID
 * @param content       回复内容
 * @param callback
 */
exports.newAndSave = function (author_id, article_id, content, callback) {
    var reply        = new Reply();
    reply.author_id  = author_id;
    reply.article_id = article_id;
    reply.content    = content
    reply.save(callback);
};