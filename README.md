# ChatFlix

ChatFlix is a web application built with React, Firebase, and CSS modules, with authentication via Gmail. The app is designed to look and feel like NetFlix, but instead of movies, it is all about programming and related topics."

## Features

1. **Authentication Options**

   - Google Authentication: Users can log in using their Gmail accounts.
   - Email/Password Authentication: Users can create an account and log in with email and password.

2. **Update Email Address**

   - Users can update their email addresses for their accounts.

3. **Password Reset**

   - Users can reset their password if they forget it. An email with a reset link will be sent to their registered email address.

4. **User Profile Customization**

   - Profile Picture Upload: Users can upload and customize their profile pictures.
   - Username Editing: Users can change their display names.
   - About Me Section: Users can provide additional information about themselves.
   - LinkedIn and GitHub Links: Users can add links to their LinkedIn and GitHub profiles.

5. **Chat Categories**

   - Frontend: Discussions about HTML, CSS, JavaScript, and related technologies.
   - Backend Frameworks: Topics covering backend technologies like Node.js, Ruby on Rails, etc.
   - Learning Platforms: Discussions about online learning platforms such as Udacity and Coursera.
   - Code Editors: Conversations related to code editors like Visual Studio Code and Sublime Text.
   - Operating Systems: Chats about different operating systems, including MacOS and Linux.
   - Many More Categories: Explore numerous other categories tailored to specific programming and tech topics.

6. **Regular Sized Chat Windows**

   - Users can engage in conversations in standard-sized chat windows for a comfortable chat experience.

7. **Full-Screen Chat**

   - Chat windows can be expanded to full-screen for a distraction-free experience.

8. **Real-Time Messaging**

   - Messages are delivered instantly, providing a seamless chatting experience.

9. **Sound Notifications**

   - Users receive audible notifications when new messages arrive, ensuring they don't miss important updates.

10. **Message Replay**

    - Users can revisit past messages for reference.

11. **Scroll to Replayed Message**

    - Conveniently scroll to the message being replayed for context.

12. **Preview Other Users' Profiles**

    - Users can view the profiles of other ChatFlix members to learn more about them.

13. **Scroll to Bottom of Chat**

    - Easily navigate to the latest messages by scrolling to the bottom of the chat.

14. **Message Reactions**

    React to messages with various emojis and expressions to engage in conversations.

15. **Sending Code Blocks**

    - Share code snippets with syntax highlighting, and preview in a VS Dark theme.

16. **Image Sending in Chat**

    - Send and receive images within chat messages for better communication.

## Customization

ChatFlix is easy to customize to your needs. Here are the steps:

1. Clone the repository
2. Replace `/src/assets/img/logo.png` with your logo
3. Update `data.js` with your array of objects with the following shape:

```
{
  name,
  id,
  logo,
  tags,
}
```

4. Configure Firebase in `/src/Firebase/`
5. Run `npm install`
6. Run `npm start`

## Demo

You can check out the live demo of ChatFlix [here](https://mxmxmarexmxm.github.io/ChatFlix/).

Thank you for your interest in ChatFlix!

## Contributing

Contributions are welcome! If you have any ideas, bug fixes, or feature requests, feel free to submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
