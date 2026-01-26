# RankMe

## Specification Deliverable

### Elevator Pitch

Have you ever had a debate with your friends about what the best pizza topping is, best ice cream flavor, or the most powerful super hero of all time? But, maybe you didn't have a great way to show what you were saying, or there were to many opininons going around at once? Well, with RankMe, you can create your custom rankings about any category and with any items you want in an ordered list, or in a tier list. You can also see your previous rankings and share them with others! No need to restrict these fun arguments to person when you can have a platform that allows you to rank anything in a fun and organized way, and so you can have it with you forever. Now, everyone in the group can have a say in the discussion, and enjoy good friendly arguments, with RankMe.  

### Design

<img width="287" height="179" alt="Screenshot 2026-01-12 223852" src="https://github.com/user-attachments/assets/02265b8a-ed46-4e7e-aca1-a83faf316046" />

<img width="819" height="514" alt="Screenshot 2026-01-12 224505" src="https://github.com/user-attachments/assets/788f28ec-44b8-4ea4-9a76-2df2d885dacd" />

<img width="1152" height="716" alt="Screenshot 2026-01-12 224622" src="https://github.com/user-attachments/assets/e32dfcac-d1c0-45ed-85c4-c4a714274846" />

<img width="1102" height="693" alt="Screenshot 2026-01-12 224803" src="https://github.com/user-attachments/assets/0b3774b0-41fd-433f-b4e5-03dbf02a44b8" />

/><img width="821" height="509" alt="Screenshot 2026-01-12 224842" src="https://github.com/user-attachments/assets/67e5bad9-4c21-437c-b356-55a8768e2eb3" />

### Key Features

  - Secure login with a username and a password
  - New users can create an account and then continue to the website
  - Ability to drag and drop items into a ranked order and into a tier list
  - Ability to add as many items as the user sees fit
  - Stores past rankings for the user to look back on
  - Ability to send rankings to other users, and see what they sent you

### Technologies

I will use the required technologies in the following ways:

  - **HTML** - Use as the base structure for the application to create 5 html pages:
      - Login screen
      - Creating an account
      - Ranking the items
      - Sharing rankings and looking at what others shared with you
      - Viewing previous rankings
  - **CSS** - Styling and formatting the web pages so that they are visably appealing to the user, and to help them understand how to use the program.
  - **React** - Provide login, item display, drag/drop functionality, displaying the rankings other users sent you, and cleanly switching between html pages.
  - **Service** - Backend service will provide endpoints for:
      - login
      - storing rankings
      - sending and recieving rankings
  - **DB/Login** - Store users, login credentials, rankings completed by the user, and rankings sent to and from the user.
  - **WebSocket** - Communicate the rankings being sent between different users.

## HTML Deliverable

### Things added

- Added a feature where you can select one of your pervious rankings and send to people.
- Turned the "view past rankings" button into a link that can be accessed from multiple pages on the website.
- Added an About page where you can see read about the website and how you can use it.
- Added an E and an F tier to the tier list on the ranking page.
- Added a link to the top on all pages so you can see what people sent you.
- Added a spot on the ranking page where you can see what user is on the app.




