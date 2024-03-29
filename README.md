# ChatFlix

ChatFlix is a web application built with React, Firebase, and CSS modules. The app is designed to look and feel like NetFlix, but instead of movies, it is all about programming and related topics.

You can check out the live demo of ChatFlix [here](https://mxmxmarexmxm.github.io/ChatFlix/).

  <div style="text-align:center"><img src="./src/assets/img/ChatFlixPreview.png" alt='ChatFlixPreview'/></div>

## Features

1.  **Authentication Options**

    - Google Authentication: Users can log in using their Gmail accounts.
    - Email/Password Authentication: Users can create an account and log in with email and password.

2.  **Update Email Address**

    - Users can update their email addresses for their accounts.

3.  **Password Reset**

    - Users can reset their password if they forget it. An email with a reset link will be sent to their registered email address.

4.  **User Profile Customization**

    - Profile Picture Upload: Users can upload and customize their profile pictures.
    - Username Editing: Users can change their display names.
    - About Me Section: Users can provide additional information about themselves.
    - LinkedIn and GitHub Links: Users can add links to their LinkedIn and GitHub profiles.

5.  **Chat Categories**

    - Frontend: Discussions about HTML, CSS, JavaScript, and related technologies.
    - Backend Frameworks: Topics covering backend technologies like Node.js, Ruby on Rails, etc.
    - Learning Platforms: Discussions about online learning platforms such as Udacity and Coursera.
    - Code Editors: Conversations related to code editors like Visual Studio Code and Sublime Text.
    - Operating Systems: Chats about different operating systems, including MacOS and Linux.
    - Many More Categories: Explore numerous other categories tailored to specific programming and tech topics.

6.  **Favorite Chats**

    - Users can add/remove chats to favorites.
    - Favorite chats with unread messages are prioritized at the top of the page, enhancing accessibility and user experience.

7.  **Regular Sized Chat Windows**

    - Users can engage in conversations in standard-sized chat windows for a comfortable chat experience.

8.  **Full-Screen Chat**

    - Chat windows can be expanded to full-screen for a distraction-free experience.
    - 100% full-screen: Clicking the hamburger menu hides/preview other active chats on the left side, providing 100% full-screen chat.

9.  **Real-Time Messaging**

    - Messages are delivered instantly, providing a seamless chatting experience.

10. **Sound Notifications**

    - Users receive audible notifications when new messages arrive, ensuring they don't miss important updates.

11. **Notification Sound Control**

    - Enable users to easily turn notification sounds on or off according to their preference.

12. **Message Replay**

    - Users can revisit past messages for reference.

13. **Scroll to Replayed Message**

    - Conveniently scroll to the message being replayed for context.

14. **Preview Other Users Profiles**

    - Users can view the profiles of other ChatFlix members to learn more about them.

15. **Scroll to the Bottom of the Chat**

    - Easily navigate to the latest messages by scrolling to the bottom of the chat.

16. **Message Reactions**

    React to messages with various emojis and expressions to engage in conversations.

17. **Sending Code Blocks**

    - Share code snippets with syntax highlighting, and preview in a VS Dark theme.
    - Users can expand code snippets to full-screen for a more detailed view.
    - Users can easily copy code

18. **Image Sending in Chat**

    - Send and receive images within chat messages for better communication.
    - Multiple Images: Users can send multiple images at once.

19. **Image Preview and Carousel**

    - Users can view images in full size and navigate through multiple images sent in a single message using a carousel.
    - Keyboard arrows provide easy navigation for a smoother image-browsing experience.

## Customization

ChatFlix is easy to customize to your needs. Here are the steps:

1. Clone the repository
2. Replace `/src/assets/img/logo.png` with your logo
3. Update `data.js` with your array of objects with the following shape:

```
{
  name,
  logo,
  tags,
}
```

4. Configure Firebase in `/src/Firebase/`
5. Run `npm install`
6. Run `npm start`

## Contributing

Contributions are welcome! If you have any ideas, bug fixes, or feature requests, feel free to submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
