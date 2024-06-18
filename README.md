# R-ttack: the Web Based RF pentesting tool



Please note that to use R-ttack you need to install the backend component here: https://github.com/EduardoCorazon/R-ttack

This repo contains the code for the actual website

# Important things to note:

- To use the charts, you must specify your own lightningChartJS license key
- Ideally you could run this entire program on a small battery powered raspberryPi to make it portable.
- There are still features we want to add (ML, user optimization, new pages, etc). If you'd like to contribute please feel free to open up an PR! 🏗

Oh yeah I almost forgot, this project and all of R-ttack is entirely **opensource** ⛓️‍💥! 

# How to install
1) git clone this repo as well as teh backend repo
2) **NOTE:** inside the R-ttack Dashboards repo there is a file called **SystemIPConfig.js** . Make sure to edit the ip with your own! There is also **license.tsx** , make sure to edit this for lightningChartJS. 
3) For R-ttack Dashboards run:
   - npm install
   - npm run build
   - npm run start
4) For R-ttack run:
   - npm install
   - sudo node r-ttack-server.js
6) Go to your respective **http://localhost:3200** and login
   username: admin
   password: password
   (very secure I know)

# How to use
Video Guide:


A proper documentation guide will be posted soon!
Buy essentially:
- attack ready = for jamming/replay attacks
- analyze ready = for analyzing frequencies & chart display
- attack & analyze = both
You can record one type and then add on the other attack or analyze feature by using setting the same capture name (ex. attack ready "testme" can become attack & analyze by recording an analyze capture called "testme")

You can select your captures dynamically to use in both analysis and engagements.
I apologize for the rushed readme file lol.
