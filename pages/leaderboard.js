import React, { useEffect, useState } from 'react'
import { Query } from 'firebase/firestore'
import LeaderboardUser from '../components/leaderBoardUser/leaderboardUser'
import styles from '../styles/leaderboard.module.css'
import Navbar from '../components/navbar/navbar'
import { useUser, signOutWithGoogle, signInWithGoogle } from "../context/userContext";

const Leaderboard = () => {
    const { loadingUser, user } = useUser();
    const [leaderboard, setLeaderboard] = useState(null)
    async function firestoreGetLeaderboard() {
    await fetch(`http://localhost:3000/api/leaderboard/route`, {
        method: "GET"
    })
    .then(res => res.json())
    .then(data => {console.log(data.data); setLeaderboard(data.data)});
    }
    useEffect(() => {
        firestoreGetLeaderboard()
    }, [])

  return (
    <div className={styles.someCSSMoludesClass}>
        <Navbar userDisplayName={user?.displayName} />
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Youtube Collect Leaderboard</h1>
            </div>
            
        <div className={styles.leaderboardContainer}>
            <div className={styles.metricLabelsContainer}>
                <h3 style={{textDecoration: 'underline', fontWeight: "200"}}>Name</h3>
                <h3 className={styles.metricLabel}>Realized Gains</h3>
                <h3 className={styles.metricLabel}>Best Pick</h3>
            </div>
            <div className={styles.leaderboardUsersContainer}>
                {leaderboard &&
            leaderboard.map((profile, index) => {
                console.log(profile)
                console.log(user)
                return(
                    <div className={styles.leaderboardUserContainer}>
                        <LeaderboardUser className={styles.leaderBoardUser} user={profile} index={index} me={user?.displayName == profile.userName ? true : false} />
                    </div>
                )
            })
        }  
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