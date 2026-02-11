import React from 'react';
import './about.css';

export function About() {
  return (
    <main className="main">
        <div className="container">
            <div className="about">
                <div>Have you ever debated with friends about the best pizza topping, the greatest ice cream flavor, or the most powerful superhero of all time—
                but struggled to organize everyone’s opinions? RankMe gives you a fun and simple way to settle (or fuel) those arguments by letting you create 
                custom rankings for any category you can imagine. Build ordered lists or tier lists, revisit your past rankings, 
                and share them with others anytime. Instead of losing track of opinions or limiting discussions to in-person conversations, 
                RankMe keeps your rankings organized, accessible, and saved forever. With RankMe, everyone gets a voice, and friendly debates
                become more engaging, visual, and fun.</div>
            </div>
            <div className="image">
                <img src="https://th.bing.com/th/id/OIP.Ute4HICJ6dnW_j2KZBQ-owHaE7?w=289&h=193&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3" width="500" height="400"/>
            </div>
        </div>
    </main>
  );
}