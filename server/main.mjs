import socket from 'socket.io';

const io = socket(8080);
const topics = new Map;
const openTopics = new Set;
const users = new Map;

let lastUserID = 0;
let lastTopicID = 0;
let lastCommentID = 0;

function createUser(username, avatar) {
  const user = {
    id: lastUserID++,
    username,
    avatar,
  };
  users.set(user.id, user);
  return user;
}

function createTopic(author, title, content) {
  const topic = {
    id: lastTopicID++,
    author,
    title,
    comments: [],
  };
  createComment(author, topic, content);
  topics.set(topic.id, topic);
  return topic;
}

function createComment(author, topic, content) {
  const comment = {
    id: lastCommentID++,
    author,
    content,
    timestamp: new Date().toISOString(),
  };
  topic.comments.push(comment);
  return comment;
}

io
  .on('connection', (client) => {
    console.log('New connection');
    let user = undefined;

    client
      .on('getTopics', () => {

      })
      .on('createTopic', ({ title, content }) => {
        if (typeof title !== 'string' || typeof content !== 'string') return;

        title = title.trim();
        content = content.trimRight();

        if (title.length < 2 || title.length > 64 || content.length < 2 || content.length > 256) return;

        const topic = createTopic(user, title, content);
        io.emit('newTopic', topic);
        client.emit('createTopic', topic);
      })
      .on('createComment', ({ topicID, content }) => {
        if (typeof topicID !== 'number' || typeof content !== 'string') return;
        
        content = content.trimRight();
        if (content.length < 2 || content.length > 256) return;
        if (!topics.has(topicID)) return;
        
        const comment = createComment(user, topics.get(topicID), content);
        io.emit('newComment', topicID, comment);
      })
      .on('login', (info) => {
        if (!(info instanceof Object)) return;
        let { username, avatar } = info;
        username = username.trim();

        if (typeof username !== 'string' || typeof avatar !== 'string' || username.length < 2 || username.length > 10) {
          client.emit('login', false);
          return;
        }

        user = createUser(username, avatar);
        client.emit('login', true, user);
      })
      .on('ping', () => {
        client.emit('pong', new Date());
      })
      ;
    client.emit('topics', [ ...topics.values() ]);
  })
  ;

/*
  Topic:
    id: 0
    comments: []
    author: {}
    title: ''
  
  Comment:
    id: 0
    author: {}
    timestamp: 0
    content: ''
  
  User:
    username: ''
    avatar: ''
    id: 0
*/