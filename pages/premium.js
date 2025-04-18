import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../styles/premium.module.css'
import Navbar from '../components/navbar/navbar'
import Image from 'next/image'
import Head from "next/head";
import { useUser } from '../context/userContext'
import firebaseApp from '../firebase/clientApp'
import {getCheckoutUrl} from '../stripe/stripePayment'
import {getPremiumStatus} from '../stripe/getPremiumStatus'

import { useCallback } from "react";
import Particles from "react-particles";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.


const Premium = () => {
    const { loadingUser, user } = useUser();
    const [leaderboard, setLeaderboard] = useState(null)
    const [isPremium, setIsPremium] = useState(false)
    const [loading, setLoading] = useState(false)
    const [referrals, setreferrals] = useState(0)
    const [referralId, setreferralId] = useState('')
    const [copied, setCopied] = useState(false)
    const [referralTrialExpires, setReferralTrialExpires] = useState(new Date())
    const [onReferralTrial, setOnReferralTrial] = useState(false)
    const [recieved, setRecieved] = useState(false)

    const router = useRouter()

    const particlesInit = useCallback(async engine => {
      console.log(engine);
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadFull(engine);
      await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
      await console.log(container);
  }, []);

    async function firestoreGetUserData(userId, retry) {
      await fetch(`/api/user/${userId}/get_data/route`, {
          method: "GET"
      })
      .then(res => {if (res.status == 450) {
        return {success: false}} 
        else 
        {return res.json();} })
      .then(data => {if (data.success) {
        setreferralId(data?.data.leaderboardId)
        console.log(data.data)
        setreferrals(data.data.referrals ? data.data.referrals.length : 0)
        if (data.data.referral_trial_expires && new Date(data.data.referral_trial_expires._seconds*1000) > new Date()) {
          setReferralTrialExpires(new Date(data.data.referral_trial_expires._seconds*1000))
          console.log(new Date(data.data.referral_trial_expires))
          setOnReferralTrial(true)
          setRecieved(true)
        }
        // }
        }});
    }

    const handleClaimReferralPremium = async(userId) => {
      await fetch(`/api/user/${userId}/claim_referral_premium/route`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
      })
      .then(res => {if (res.status == 308) {
        alert("Error: Not Enough Referrals!")
        return {success: false}} 
        else if (res.status != 200) {
          return {success: false} 
        }
        else 
        {return res.json();} })
      .then(data => {if (data.success) {
        console.log("Success!!!")
        router.push("/")
        }});
    }

    useEffect(() => {
      const checkPremium = async () => {
        if (firebaseApp) {
          const newPremiumStatus = user
          ? await getPremiumStatus(firebaseApp)
          : false;
        setIsPremium(newPremiumStatus);
      };
        }
      
      checkPremium();
      if (user && !recieved) {
        firestoreGetUserData(user.uid)
      }
      
    }, [firebaseApp, user]);
    
    const handleUpgradeToPremium = async () => {
      setLoading(true)
      const priceId = "price_1R8CmlHaSp5G9lrwqnZJvr15"
      const checkoutUrl = await getCheckoutUrl(firebaseApp, priceId)
        await fetch(`/api/user/${user.uid}/check_premium/route`, {
            method: "GET"
        })
        .then(res => {router.push(checkoutUrl); setLoading(false)})
        setLoading(false)
    }
    var numDaysBetween = function(d1, d2) {
      var diff = Math.abs(d1.getTime() - d2.getTime());
      return diff / (1000 * 60 * 60 * 24);
    };

  return (
    <div className={styles.someCSSMoludesClass}>
      <Head>
        <title>Premium || Youtube Collect</title>
        <link rel="icon" href="/youCoinsLogo.png" />
      </Head>
        <Navbar userDisplayName={user?.displayName} />
        <div className={styles.container}>
        <h1 className={styles.title} style={{zIndex:10, position: "sticky"}}>Youtube Collect Premium</h1>
        <Particles
            init={particlesInit}
            loaded={particlesLoaded}
            className={styles.particles}
            height={'100%'}
            options={{
                background: {
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#c10000",
                    },
                    links: {
                        color: "#000000",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 2,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 0.2,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 5, max: 5 },
                    },
                },
                detectRetina: true,
            }}
        />
  <div style={{zIndex:10, position: "sticky"}}>
<div className={styles.plans}>
    
    {/* Basic Plan Card */}
    <div className={styles.card}>
      <h2>
        <p>Collect Basic</p>
      <Image 
        src="/youCoinsLogo.png"
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
        <li><b>1%</b> chance of an investment crash on every open of the app</li>
      </ul>
      <button className={styles.button} disabled={isPremium ? false : true}>{isPremium ? "Basic Plan" : "Current Plan"}</button>
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
      <p className={styles.price}>$9 one time fee</p>
      <ul className={styles.featureList}>
        <li><b>8</b> trades per day</li>
        <li><b>5</b> active investments at a time</li>
        <li><b>6</b> minute Investment cooldown</li>
        <li><b>75%</b> limit of available balance to invest in one video</li>
      </ul>
      <button disabled={loading ? true : (isPremium ? true : false)} className={styles.button} onClick={handleUpgradeToPremium}>{isPremium ? "Current Plan" : "Upgrade"}</button>
        {onReferralTrial &&
        <div className={styles.referralBox}>
        <h2>Premium Trial Ends In</h2>
        <div>
          {Math.floor(numDaysBetween(new Date(), new Date(referralTrialExpires)))} 
          
        </div>
        <p>Days</p>
      </div>}
      </div>
    
    </div>
    {!isPremium &&
    <div className={styles.premiumForFree}>
  <div className={styles.referralCard}>
    <h2 className={styles.header}>Want Premium For Free?</h2>
    <p className={styles.description}>
      Refer <strong>5 friends</strong> this month to unlock <span className={styles.highlight}>premium benefits</span>.
    </p>

    <div className={styles.linkBox}>
      <p className={styles.instructions}>
      Send this referral link to new players to create an account:
      </p>
      <input disabled value={`https://youtube-collect.vercel.app?referral=${referralId}`} style={{width: "50%"}}/>
      <button className={styles.copyButton} style={copied ? {background: "rgb(22, 109, 5)"} : {}} onClick={() => {navigator.clipboard.writeText(`https://youtube-collect.vercel.app?referral=${referralId}`); setCopied(true)}}>
        {!copied ?
        <>Copy Referral Link</>
        :
        <>Copied!</>
        }
        </button>
    </div>

    <p className={styles.progress}>
      {referrals} / 5 Successfully Referred
    </p>
      <div className={styles.claimButtonContainer}>
        <button className={(referrals >= 5) ? styles.claimButton : styles.claimButtonDisabled} disabled={(referrals >= 5) ? false : true} onClick={() => {handleClaimReferralPremium(user.uid)}}>
    <Image 
        src="/premiumLogo.png"
        width={50}
        height={50}
        alt="Picture of the author"
        /> 
      Claim Premium For A Month!
    </button>
      </div>
    
  </div>
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