import React, { useEffect, useState } from 'react';
import AboutNavbar from '../components/aboutNavBar/navbar/navbar';
import GameIntro from '../components/GameIntro/GameIntro';
import HowToPlay from '../components/HowToPlay/HowToPlay';
import GameTips from '../components/GameTips/GameTips';
import styles from '../styles/about.module.css';
import Footer from '../components/footer/footer';
import Image from 'next/image';
import { numify } from 'numify';
import Link from 'next/link'

const Index = () => {
    const [totalUsers, setTotalUsers] = useState(0)
    async function firestoreGetTotalUsers() {
        await fetch(`/api/leaderboard/total_users/route`, {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
          if (data) {
            setTotalUsers(data.total)
          }
        });
        }
    
        useEffect(() => {
          firestoreGetTotalUsers()
        }, [])
  return (
    <div className={styles.landingContainer}>
      <main className={styles.main}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
          <Image 
          src="/youCoinsLogo.png"
        width={100}
        height={100}
        alt="Picture of the author"
        />
            <h1 className={styles.heroTitle}>YouTube Collect</h1>
            <p className={styles.heroDescription}>
              Invest in videos, predict viral hits, top the leaderboard!
            </p>
            {totalUsers &&
          <div className={styles.totalUsersContainer}>
              <h3>{numify(totalUsers)} Total Current Players</h3>
            </div>
          }
            <Link href={`https://chromewebstore.google.com/detail/cffeplhkppfdbameoggalnjjjklekffp?utm_source=item-share-cb`} passHref legacyBehavior>
            <button className={styles.ctaButton}>Install Chrome Extension</button>
            </Link>
          </div>
        </div>

        <GameIntro />
        <HowToPlay />
        <GameTips />
        <Footer />
      </main>

      {/* <Footer /> */}

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          background: black;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Index;
