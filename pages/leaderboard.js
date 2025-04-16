import React, { Fragment, useEffect, useState } from 'react'
import { Query } from 'firebase/firestore'
import LeaderboardUser from '../components/leaderBoardUser/leaderboardUser'
import styles from '../styles/leaderboard.module.css'
import Head from "next/head";
import Navbar from '../components/navbar/navbar'
import { useUser, signOutWithGoogle, signInWithGoogle } from "../context/userContext";
import ClipLoader from "react-spinners/HashLoader";
import Countdown from 'react-countdown';

const Leaderboard = () => {
    const { loadingUser, user } = useUser();
    const [leaderboard, setLeaderboard] = useState(null)
    const [loading, setLoading] = useState(true)
    const [leaderboardId, setLeaderboardId] = useState("")
    const nextRefreshDate = getNextLeaderboardRefresh();

    const override = {
      display: "block",
      margin: "0 auto",
      borderColor: "red",
    };

    useEffect(() => {
      const curr_id = localStorage.getItem("leaderboardId") || "efsdiuy"
      setLeaderboardId(curr_id)
    }, [])

    async function firestoreGetLeaderboard() {
    await fetch(`/api/leaderboard/route`, {
        method: "GET"
    })
    .then(res => res.json())
    .then(data => {
      setLeaderboard(data.data);
      setLoading(false)
    });
    }
    useEffect(() => {
        firestoreGetLeaderboard()
    }, [])

    function getNextLeaderboardRefresh() {
      const now = new Date();
      const minutes = now.getMinutes();
    
      const next = new Date(now);
      next.setSeconds(0);
      next.setMilliseconds(0);
    
      if (minutes < 30) {
        next.setMinutes(30);
      } else {
        next.setMinutes(0);
        next.setHours(now.getHours() + 1);
      }
    
      return next;
    }

  return (
    <div className={styles.someCSSMoludesClass}>
      <Head>
        <title>Leaderboard || Youtube Collect</title>
        <link rel="icon" href="/youCoinsLogo.png" />
      </Head>
        <Navbar userDisplayName={user?.displayName} />
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Youtube Collect Leaderboard</h1>
                <p className={styles.refreshLeaderboardTimer}>
                  <b>Leaderboard Refresh: </b> {" "} <Countdown date={nextRefreshDate}><Fragment>Reload to Refresh!</Fragment></Countdown>
                </p>
            </div>
        <div className={styles.leaderboardContainer}>
          {
            !loading ?
            <>
              <div className={styles.metricLabelsContainer}>
                  <h3 style={{textDecoration: 'underline', fontWeight: "200"}}>Name</h3>
                  <h3 className={styles.metricLabel}>Realized Gains</h3>
                  <h3 className={styles.metricLabel}>Best Pick</h3>
              </div>
              <div className={styles.leaderboardUsersContainer}>
                  {leaderboard &&
              leaderboard.map((profile, index) => {
                  return(
                      <div className={styles.leaderboardUserContainer}>
                          <LeaderboardUser className={styles.leaderBoardUser} user={profile} index={index} me={leaderboardId == profile.id ? true : false} />
                      </div>
                  )
              })
          }  
              </div>
            </>
            :
            <div className={styles.loadingContainer}>
              <ClipLoader
                className={styles.loading}
                color="#e10707"
                loading={true}
                cssOverride={override}
                size={80}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
            
            
          }
            
          
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

export default Leaderboard