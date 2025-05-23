'use client'
import { getFirestore, setDoc, doc } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useUser, signOutWithGoogle, signInWithGoogle } from "../context/userContext";
import styles from '../styles/home.module.css'
import Navbar from "../components/navbar/navbar";
import Image from 'next/image'
import VideoInvestment from "../components/videoInvestment/videoInvestment";
import NumberFlow from '@number-flow/react'
import HistoryInvestment from "../components/historyInvestment/historyInvestment";
import ClipLoader from "react-spinners/HashLoader";
import { numify } from "numify";
import { generateUsername } from "unique-username-generator";
import { useSearchParams } from 'next/navigation'
import ReferralAlert from "../components/referralAlert/referralAlert";

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
  const [currentUser, setCurrentUser] = useState(user)
  const [signInLoading, setSignInLoading] = useState(false)
  const [showBestPick, setShowBestPick] = useState(false)
  const [totalUsers, setTotalUsers] = useState(null) 
  const [historyRecieved, setHistoryRecieved] = useState(false)
  const [referralCodeFound, setReferralCodeFound] = useState(false)
  const searchParams = useSearchParams()
  const [referralCode, setReferralCode] = useState('')
  const [timedout, setTimedout] = useState(false)

  useEffect(() => {
    const code = searchParams.get('referral')
    if (code) {
      console.log("Referral code detected:", code)
      setReferralCode(code)
      setReferralCodeFound(true)
    } else {
      console.log("No referral code found")
    }
  }, [searchParams])

  useEffect(() => {
    setTimeout(() => { setTimedout(true); }, 
    5000)
  }, [timedout])

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };


  async function firestoreUpdateUserData(userId, referralCode) {
    await fetch(`/api/user/${userId}/set_data/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: 100, userId: userId, investments: videoInvestments, userName: generateUsername("", 2, 15), referralCode })
    })
    .then(res => res.json())
  }

const handleSignout = () => {
  signOutWithGoogle()
  setInvestmentsLoaded(false)
  setVideoInvestments([])
  setVideoInvestmentHistory([])
}

async function firestoreGetUserData(userId, retry) {
  await fetch(`/api/user/${userId}/get_data/route`, {
      method: "GET"
  })
  .then(res => {if (res.status == 450) {
    if (retry <= 1) {
      firestoreUpdateUserData(userId, referralCode).then(data => {
      firestoreGetUserData(userId, retry+1);
        setInvestmentsLoaded(true)
    }
      )
    }
    
    return {success: false}} 
    else 
    {return res.json();} })
  .then(data => {if (data.success) {
    setFirestoreUserData(data?.data); 
    setShowBestPick(data.data.showBestPick)
    stripeCheckUserPremium(user.uid, data.data.premium)
    localStorage.setItem("leaderboardId", data.data?.leaderboardId || "ewefsghdyri")
    localStorage.setItem("userName", data.data?.userName || "shrek")
    // setInTrial(data?.data?.trial)
    // if (data?.data?.trial == true) {
    //   console.log(data.data.trial_expires)
    //   const diffMs = Math.abs(new Date(data.data.trial_expires._seconds*1000) - new Date(Date.now()));
    //   const totalHours = Math.floor(diffMs / (1000 * 60 * 60)); // Total whole hours
    //   const days = Math.floor(totalHours / 24); // Whole days
    //   const hours = totalHours % 24; 
    //   setTrialExpires([days, hours])
    // }
    }});
}


async function firestoreCheckUserInvestments(userId) {
  var new_investments = []
    await fetch(`/api/user/${userId}/investment_checks/route`, {
        method: "GET"
    })
    .then(res => {return res.json();})
    .then(data => {new_investments = data?.data?.investments});
    return new_investments
  }

  async function stripeCheckUserPremium(userId, currPremium) {
    await fetch(`/api/user/${userId}/check_premium/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curr_premium: currPremium })
    })
    .then(res => {return res.json()})
  }

  const getCurrentBalance = async() => {
    const balanceData = firestoreUserData.balance
    const video_investments = videoInvestments
    var newBalance = balanceData
    if (balanceData) {
      var unrealized = 0
      var valueOfHoldings = 0
      if (video_investments.length >= 1 && balanceUpdated == false) {
        for (let i = 0; i < video_investments.length; i++) {
        const inv = video_investments[i]
        unrealized = unrealized + inv.holdingProfit
        newBalance = newBalance + inv.holdingProfit
        valueOfHoldings = valueOfHoldings + ((inv.investment_total_before_crash || inv.investment_total) + inv.holdingProfit)
      }
      setBalanceUpdated(false)
      setBalance(newBalance)
      setUnrealizedGains(unrealized)
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
}, [firestoreUserData, videoInvestments, user])



  useEffect(() => {
      const myAsyncFunction = async() => {
        if (user) {
        await firestoreGetUserData(user.uid, 0)
        await get_video_investments()
        setLoggedIn(true)
      } else {
        setLoggedIn(false)
      }
      }
      myAsyncFunction()
  }, [user?.uid]);

  useEffect(() => {
    if (firestoreUserData) {
    }
    
  }, [firestoreUserData])

  useEffect(() => {
    setHoldingHistoryOpen(!currentHoldingsOpen)
  }, [currentHoldingsOpen, holdingHistoryOpen])

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

    const handleHistoryOpen = async() => {
      if (!historyRecieved) {
          await fetch(`/api/user/${user?.uid}/get_history/route`, {
          method: "GET"
      })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setVideoInvestmentHistory(data.data);
          setHistoryRecieved(true)
        }
      });
      }
    }

  return (
    <div className={styles.container}>
      <Head>
        <title>Home || Youtube Collect</title>
        <link rel="icon" href="/youCoinsLogo.png" />
        <meta name="google-site-verification" content="odCTNV3mrGrvM2JpHbiMllYzHWTEldh95mlprg9skOA" />
      </Head>

      <main>
        {(user) &&
          <Navbar userDisplayName={firestoreUserData?.userName ? firestoreUserData.userName : user.displayName} showBestPick={showBestPick} setShowBestPick={setShowBestPick}/>
        
        }
        {(firestoreUserData && balance < 100 && !timedout) &&
              <>
              <div style={{
      position: 'fixed',
      top: '130px',
      right: '20px',
      backgroundColor: '#860606',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: "center",
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 9999
    }}>
      <div>
        <span style={{fontSize: '20px', marginRight: '10px' }}>⚠️</span>
        
      <span style={{display: "flex"}}>
        Current Balance Under
        <div style={{display: "flex", alignContent: "center"}}>
          <Image 
          src="/youCoinsLogo.png"
        width={20}
        height={20}
        alt="Picture of the author"
        />
        100! 
        </div>
      
        </span><p style={{display: "flex",fontSize:"10px", justifyContent: "center"}}>If you want to reset, click on your profile and click "Reset Everything"</p>
      </div>
      
      
    </div>
              </>
              
              }
  {(firestoreUserData?.rank && user) && (
  <div className={styles.rankSection} style={firestoreUserData.rank <= 3 ? {backgroundImage: "linear-gradient(135deg, #540d0d, #000000)", borderRadius: "16px"}: {background: "black", borderRadius: "16px"}}>
    <div className={styles.rankWrapper}>
      <span className={styles.rankLabel}>Global Rank</span>
      <span className={styles.rankNumber} style={firestoreUserData.rank <= 10 ? {backgroundImage: "linear-gradient(to right, #ffd700, #ffa500)",
    color: "transparent",
    backgroundClip: "text"} : 
    {backgroundImage: "linear-gradient(to right, #ffffff, #a3a3a3)",
    color: "transparent",
    backgroundClip: "text"}
    }>#{numify(firestoreUserData.rank)}</span>
    </div>
  </div>
)}
        
        {(firestoreUserData && user && !loadingUser) ?
        <div>
          {/* {inTrial && (
  <div className={styles.trialExpiresIn}>
    <div>
      <h3 className={styles.heading}>Premium Trial Expires In</h3>
      <p className={styles.time}>
        <b>{trialExpires[0]}</b> Days and <b>{trialExpires[1]}</b> hours
      </p>
    </div>
  </div>
)} */}
          <div className={styles.balanceContainer}>
            {user.isPremium ?
            <Image 
          src="/premiumCoins.png"
        width={100}
        height={100}
        alt="Picture of the author"
        />
        :
        <Image 
          src="/youCoinsLogo.png"
        width={100}
        height={100}
        alt="Picture of the author"
        />
          }
          
          <h1 className={"title"}>
          <NumberFlow value={(Number(balance.toFixed(2)))} />  
            </h1>
        </div>
        
        <div className={styles.investmentsOptionsContainer}>
          <h2 className={styles.investmentsOptionsHeader} style={holdingHistoryOpen ? {color: "rgba(240, 248, 255, 0.328)"} : {color: "white"}} onClick={() => {setCurrentHoldingsOpen(true); setHoldingHistoryOpen(false)}}>Current Holdings</h2>
          <h2 className={styles.investmentsOptionsHeader} style={currentHoldingsOpen ? {color: "rgba(240, 248, 255, 0.328)"}: {color: 'white'}} onClick={() => {handleHistoryOpen(); setHoldingHistoryOpen(true); setCurrentHoldingsOpen(false)}}>Investment History {holdingHistoryOpen && "(30)"}</h2>
        </div>
          
          {
            currentHoldingsOpen &&
            <div className={styles.investmentsContainer}>
              {(videoInvestments && investmentsLoaded) ?
              <>
                {videoInvestments.length > 0 ?
                  videoInvestments.map((video) => {
                  return (
                    <div>
                      <VideoInvestment key={video.id} video={video} me={video.isAngelInvestor} />
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
              {videoInvestmentHistory.length > 0 ? 
              <>
                  {videoInvestmentHistory.map((video) => {
                  return (
                    <div>
                      <HistoryInvestment key={video.id} video={video} />
                    </div>
                  )
                })}
              </>
              :
              <h2 style={{color: "white"}}>No Previous Holdings</h2>
            }
              
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
        <div>
          {
            (!loadingUser && !user) ?
            <div>
              {referralCodeFound &&
              <>
              <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '12px 20px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: "center",
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 9999
    }}>
      <div>
        <span style={{fontSize: '20px', marginRight: '10px' }}>✅</span>
      <span>Referral Code Detected!<br /><p style={{display: "flex",fontSize:"10px", justifyContent: "center"}}>Double check if it is the correct code</p></span>
      </div>
      
      
    </div>
              </>
              
              }
              <h1 className={styles.title}>Welcome to Youtube Collect</h1>
          <p className={styles.description}>Invest in YouTube videos like stocks. Predict trends. Earn YouCoins. Climb the leaderboard.</p>
          {totalUsers &&
          <div className={styles.totalUsersContainer}>
              <h3>{numify(totalUsers)} Total Current Players</h3>
            </div>
          }
          
            <div className={styles.buttonContainer}>
            
              <button className={styles.signinButton} disabled={user ? true : false || signInLoading} onClick={user ? handleSignout : () => {setSignInLoading(true); signInWithGoogle().then(data => setSignInLoading(false))}}>
            Sign {user ? "Out" : "In With Google"}
          </button>
          </div>
              <footer className={styles.footer}>
          &copy; 2025 YouTube Collect. All rights reserved.
        </footer>
            </div>
            :
            <ClipLoader
                className={styles.loading}
                color="#e10707"
                loading={true}
                cssOverride={override}
                size={80}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            
          }
          
        </div>
        
        }
        

      </main>

      <style jsx>{`
        main {
          padding: 1rem 0;
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
          background: black;
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
