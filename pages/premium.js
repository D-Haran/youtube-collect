import React, { useEffect, useState } from 'react'
import styles from '../styles/premium.module.css'
import Navbar from '../components/navbar/navbar'
import Image from 'next/image'
import { useUser } from '../context/userContext'

const Premium = () => {
    const { loadingUser, user } = useUser();
    const [leaderboard, setLeaderboard] = useState(null)
    async function firestoreGetLeaderboard() {
    await fetch(`https://youtube-collect-kqmsvpgbq-dharans-projects-840a6d7c.vercel.app/api/leaderboard/route`, {
        method: "GET"
    })
    .then(res => res.json())
    .then(data => {console.log(data.data); setLeaderboard(data.data)});
    }
    

  return (
    <div className={styles.someCSSMoludesClass}>
        <Navbar userDisplayName={user?.displayName} />
        <div className={styles.container}>
        <h1 className={styles.title}>Youtube Collect Premium</h1>

  <div className={styles.plans}>
    {/* Basic Plan Card */}
    <div className={styles.card}>
      <h2>
        <p>Collect Basic</p>
      <Image 
        src="/YouCoins_Logo.png"
        width={80}
        height={80}
        alt="Picture of the author"
        /> 
        
        </h2>
      <p className={styles.price}>Free</p>
      <ul className={styles.featureList}>
        <li><b>5</b> trades per day</li>
        <li><b>3</b> active investments at a time</li>
        <li><b>10</b> minute Investment cooldown</li>
        <li><b>65%</b> limit of available balance to invest in one video</li>
      </ul>
      <button className={styles.button} disabled>Current Plan</button>
    </div>

    {/* Premium Plan Card */}
    <div className={styles.card + ' ' + styles.premium}>
      <h2>
        <p>Collect Premium</p>
        <Image 
        src="/premiumLogo.png"
        width={80}
        height={80}
        alt="Picture of the author"
        /> 
        
    </h2>
      <p className={styles.price}>$2.99/month</p>
      <ul className={styles.featureList}>
        <li><b>12</b> trades per day</li>
        <li><b>5</b> active investments at a time</li>
        <li><b>6</b> minute Investment cooldown</li>
        <li><b>75%</b> limit of available balance to invest in one video</li>
      </ul>
      <button className={styles.button}>Upgrade</button>
        </div>
    </div>
        </div>

    <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        button {
          font-size: 1.5em;
          margin: 1em 0;
        }

        a {
          color: blue;
          font-size: 1.5em;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition:
            color 0.15s ease,
            border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>
    <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
    
    
  )
}

export default Premium