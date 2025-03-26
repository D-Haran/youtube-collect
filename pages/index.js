import { getFirestore, setDoc, doc } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser, signOutWithGoogle, signInWithGoogle } from "../context/userContext";
import styles from '../styles/home.module.css'
import Navbar from "../components/navbar/navbar";
import Image from 'next/image'
import VideoInvestment from "../components/videoInvestment/videoInvestment";
import NumberFlow from '@number-flow/react'
import HistoryInvestment from "../components/historyInvestment/historyInvestment";
import ClipLoader from "react-spinners/HashLoader";

export default function Home() {
  // Our custom hook to get context values
  const { loadingUser, user } = useUser();
  const [loggedIn, setLoggedIn] = useState(false)
  const [firestoreUserData, setFirestoreUserData] = useState(null)
  const [videoInvestments, setVideoInvestments] = useState([])
  const [balance, setBalance] = useState(0)
  const [availableBalance, setAvailableBalance] = useState(0)
  const [unrealizedGains, setUnrealizedGains] = useState(0)
  const [balanceUpdated, setBalanceUpdated] = useState(false)
  const [currentHoldingsOpen, setCurrentHoldingsOpen] = useState(true)
  const [holdingHistoryOpen, setHoldingHistoryOpen] = useState(true)
  const [videoInvestmentHistory, setVideoInvestmentHistory] = useState([])
  const [investmentsLoaded, setInvestmentsLoaded] = useState(false)

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

async function firestoreUpdateUserData(userId) {
  await fetch(`https://youtube-collect-kqmsvpgbq-dharans-projects-840a6d7c.vercel.app/api/user/${userId}/set_data/route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ balance: balance, userId: userId, investments: videoInvestments })
  })
  .then(res => res.json())
  .then(data => console.log("Balance updated:", data));
}

const handleSignout = () => {
  signOutWithGoogle()
  setInvestmentsLoaded(false)
  setVideoInvestments([])
  setVideoInvestmentHistory([])
}

async function firestoreGetUserData(userId) {
  await fetch(`https://youtube-collect-kqmsvpgbq-dharans-projects-840a6d7c.vercel.app/api/user/${userId}/get_data/route`, {
      method: "GET"
  })
  .then(res => res.json())
  .then(data => {setFirestoreUserData(data.data); setVideoInvestmentHistory(data.data.investmentHistory.reverse())});
}


async function firestoreCheckUserInvestments(userId) {
  var new_investments = []
    await fetch(`https://youtube-collect-kqmsvpgbq-dharans-projects-840a6d7c.vercel.app/api/user/${userId}/investment_checks/route`, {
        method: "GET"
    })
    .then(res => {return res.json();})
    .then(data => {console.log("DATA: ", data); new_investments = data.data.investments});
    return new_investments
  }

  const getCurrentBalance = async() => {
    const balanceData = firestoreUserData.balance
    const video_investments = videoInvestments
    var newBalance = balanceData
    if (balanceData) {
      var invested = 0
      var valueOfHoldings = 0
      if (video_investments.length >= 1 && balanceUpdated == false) {
        for (let i = 0; i < video_investments.length; i++) {
        const inv = video_investments[i]
        console.log(inv)
        invested = invested + inv.investment_total
        newBalance = newBalance + (((inv.curr_ratio / (inv.initial_ratio)) || 1)*inv.investment_total - inv.investment_total)
        valueOfHoldings = valueOfHoldings + ((inv.curr_ratio / (inv.initial_ratio)) || 1)*inv.investment_total
      }
      setBalanceUpdated(false)
      setBalance(newBalance)
      setUnrealizedGains(valueOfHoldings - invested)
      setAvailableBalance(newBalance - valueOfHoldings)
      
      } else {
        if (balanceUpdated == false) {
          setBalance(newBalance)
        setAvailableBalance(newBalance)
        // setBalanceUpdated(true)
        }
      }
    }
  }

const get_video_investments = async() => {
  const firestoreInvestmentCheck = await firestoreCheckUserInvestments(user.uid)
    if (firestoreInvestmentCheck) {
      setVideoInvestments(firestoreInvestmentCheck)
      setInvestmentsLoaded(true)
    }
}

useEffect(() => {
  if (firestoreUserData) {
    getCurrentBalance()
  }
}, [firestoreUserData, videoInvestments])

useEffect(() => {
  console.log(videoInvestments)
}, [videoInvestments])


  useEffect(() => {
    if (!loadingUser) {
      if (user) {
        firestoreGetUserData(user.uid)
        get_video_investments()
        setLoggedIn(true)
        console.log("INVESTMENTS:", videoInvestments)
      } else {
        setLoggedIn(false)
      }
    }
    // You also have your firebase app initialized
  }, [loadingUser, user]);

  useEffect(() => {
    if (firestoreUserData) {
      console.log(firestoreUserData.investments)
    }
    
  }, [firestoreUserData])

  const createUser = async () => {
    if (!loadingUser && loggedIn) {
      console.log(user?.uid)
      const db = getFirestore();
      const profile = { balance: 0, investments: {} };
      await setDoc(doc(db, "profile", String(user.uid)), profile);
    } else {
      alert("User is not logged in yet")
    }
  };

  useEffect(() => {
    setHoldingHistoryOpen(!currentHoldingsOpen)
  }, [currentHoldingsOpen, holdingHistoryOpen])


  return (
    <div className={styles.container}>
      <Head>
        <title>Youtube Collect</title>
        <link rel="icon" href="/YouCoins_logo.png" />
      </Head>

      <main>
        {user &&
          <Navbar userDisplayName={user.displayName}/>
        
        }
        
        {firestoreUserData ?
        <div>
          <div className={styles.balanceContainer}>
          <Image 
          src="/YouCoins_logo.png"
        width={100}
        height={100}
        alt="Picture of the author"
        />
          <h1 className="title">
          <NumberFlow value={(Number(balance.toFixed(2)))}  />  
            </h1>
        </div>
        <div className={styles.investmentsOptionsContainer}>
          <h2 className={styles.investmentsOptionsHeader} style={holdingHistoryOpen ? {color: "rgba(240, 248, 255, 0.328)"} : {color: "white"}} onClick={() => {setCurrentHoldingsOpen(true); setHoldingHistoryOpen(false)}}>Current Holdings</h2>
          <h2 className={styles.investmentsOptionsHeader} style={currentHoldingsOpen ? {color: "rgba(240, 248, 255, 0.328)"}: {color: 'white'}} onClick={() => {setHoldingHistoryOpen(true); setCurrentHoldingsOpen(false)}}>Investment History</h2>
        </div>
          
          {
            currentHoldingsOpen &&
            <div className={styles.investmentsContainer}>
              {(videoInvestments && investmentsLoaded) ?
              <>
                {videoInvestments.length > 0 ?
                  videoInvestments.map((video) => {
                  console.log(video)
                  return (
                    <div>
                      <VideoInvestment key={video.id} video={video} />
                    </div>
                  )
                })
                :
                <h2 style={{color: "white"}}>No Current Holdings</h2>
                }
              </>
              :
              <>
              <ClipLoader
                className={styles.loading}
                color="#e10707"
                loading={true}
                cssOverride={override}
                size={80}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              </>
            }
            </div>

          }
          
          {
            holdingHistoryOpen &&
            <>
              {(videoInvestmentHistory)?
              <div className={styles.videoInvestmentHistoryContainer}>
                  {videoInvestmentHistory.map((video) => {
                  console.log(video)
                  return (
                    <div>
                      <HistoryInvestment key={video.id} video={video} />
                    </div>
                  )
                })}
              </div>
              
              :
              <>
              <ClipLoader
                className={styles.loading}
                color="#e10707"
                loading={true}
                cssOverride={override}
                size={80}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              </>
              }
            </>
          }
        </div>
        :
        <button onClick={user ? handleSignout : signInWithGoogle}>Sign {user ? "Out" : "In"}</button>
        }
        

      </main>

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
          font-size: 3rem;
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
  );
}
