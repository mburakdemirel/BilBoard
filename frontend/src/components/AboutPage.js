import React from 'react';
import Logo from './assets/landingPage/logo.png'
import './assets/bootstrap/css/bootstrap.min.css'; // Import Bootstrap CSS
const AboutPage = () => {
    return (
        <div style={{background:'#edf0f7', textAlign:'left', padding:'5%'}}>
            <div className="d-flex flex-column w-100 align-items-center">
                <img src={Logo} width="489" />
                <h1 style={{fontWeight:'bold'}}>BilBoard: A Web Application for Bilkent University Students</h1>
            </div>


            <section style={{marginTop:'3%'}} >
                <h2>Project Name and Team Members</h2>
                <p>The name of this web application is BilBoard, which comes from the fact that Bilkent students can create posts or notices in this application.</p>

                <h3>Our Team</h3>
                <ul>
                    <li>Eren Arım</li>
                    <li>Yusuf Toraman</li>
                    <li>Dilara Mandıracı</li>
                    <li>Burak Demirel</li>
                    <li>Sıla Özel</li>
                </ul>

                <h2>About Our Web Application</h2>
                <p>This web application, BilBoard, is a team project for our CS-319 course for the Fall 2023-2024 term. BilBoard aims to have four main features: secondhand sales, lost and found, borrow, and donation, and one additional feature: a complaint system. Each feature is aimed at solving some common problems among Bilkent University students. Also, this web application can only be used by the Bilkent students.</p>
                {/* ... previous content ... */}

                <p>What motivates us to create such a project is that this web application will solve some of the biggest problems for Bilkent students: not having secure media for exchanging personal belongings and sharing complaints. Secondhand item sales, borrowing, donations, reporting lost items, or posting school-related complaints on unofficial accounts on social media platforms like Instagram, Facebook, and Twitter are done by many students. Doing these kinds of transactions through unofficial accounts raises security and reliability concerns for students. The BilBoard website promises students the ability to carry out these tasks in a peaceful, secure, and convenient manner. For instance, in a secondhand sale that is done through Instagram, there may be concerns about deception between two students. However, with the implementation of BilBoard, we will act as a responsible intermediary for facilitating such transactions. While safeguarding users' personal information and all forms of data, we will also serve as a trustworthy mediator for sales, agreements, and exchanges.</p>

                <h2>Features of BilBoard</h2>
                <h3>Secondhand Sales</h3>
                <p>For the secondhand sales feature, for example, every year, students try to find some secondhand stuff from the upper classes, such as books or tech devices like Basys 3. With the help of this application, they can easily reach each other and buy/sell their items. This will be way easier than texting to the huge WhatsApp groups to find those people since this app will directly target sellers and buyers according to the specific product.</p>

                <h3>Lost and Found Items</h3>
                <p>For the lost and found feature, our school doesn't have such a system that students can check their lost stuff. As stated earlier, students use unofficial social media accounts to address lost items or leave the found item to the security officers, or sometimes, they don't even know what to do when they find a lost item and leave it as is. Rather than reaching some unofficial Instagram pages or leaving it to security officers until the owner comes, lost items can be addressed to the students from a common web page, and it will be safer than reaching an unofficial Instagram page.</p>

                <h3>Borrowing</h3>
                <p>Our third feature, "Borrow," can be useful for short-term needed pieces, and it will strengthen the community feeling and solidarity among Bilkent University students. For example, sometimes we have open book exams and some of the books are really expensive. If a student just wants to bring the book to the exam, they can borrow it from someone else for just 3 hours. Also, in some exams, calculators are allowed, but buying an expensive calculator just for a couple of exams can be a waste for some students. Instead of buying a new one, they can again borrow it from someone. However, since we don't have such a platform, students send messages in WhatsApp groups in the hope of finding a person who has the needed item. Instead, with our borrowing feature, students will be able to borrow the items they need for a short time more securely and quickly.</p>

                <h3>Donation</h3>
                <p>In our fourth feature, "Donation," we address a common challenge students face: certain books, devices, or equipment they use regularly can't be sold secondhand or simply aren't worth selling. Currently, there needs to be a platform that facilitates or simplifies this process for them. With our website's donation feature, students can effortlessly connect with those who would benefit from the items they wish to donate. This feature not only helps reduce the waste of items students no longer find valuable but also offers financial relief to the recipients.</p>

                <h3>Complaint System</h3>
                <p>For our app's additional feature, we decided to do a complaint system where students can write their complaints in a formal manner. Again, students send their complaints as posts on unofficial Instagram accounts and wait to be heard or try to find other people who support them. But sometimes, their posts can be left unseen among other posts. Because of this issue, we decided to add a complaint system feature to our application. In this feature, if other people agree with the complaint, they can upvote it, or if they disagree, they can downvote it. With this, Bilkent students can share their complaints and find support more systematically.</p>

            </section>
        </div>
    );
};

export default AboutPage;
