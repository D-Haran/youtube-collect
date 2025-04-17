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
import Head from 'next/head';

import { useCallback } from "react";
import Particles from "react-particles";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.

const Index = () => {
    const [totalUsers, setTotalUsers] = useState(null)
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
        <Head>
        <title>About || Youtube Collect</title>
        <link rel="icon" href="/youCoinsLogo.png" />
        <meta name="google-site-verification" content="odCTNV3mrGrvM2JpHbiMllYzHWTEldh95mlprg9skOA" />
      </Head>
      <main className={styles.main}>
      
        
        <div className={styles.heroSection} style={{zIndex:100}}>
           <p className={styles.alreadyAPlayer}>
            Already a player?
            <Link href={`/`} passHref legacyBehavior>
            <button className={styles.dashboardButton}>
                Go To Dashboard
            </button>
            </Link>
        </p> 
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

           <GameIntro />
        <div><div className={styles.demoVideo}>
          <h1>Demo</h1>
          <div
            style={{
                position: "relative", 
                overflow: "hidden",
                display: "flex",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center"
            }}
            >
                
                    <iframe
                src="https://www.loom.com/embed/2734d7eeaa904f5d92ebc3f6438fb053?sid=da23bc8a-864b-4cde-be4e-395d03d68585"
                frameBorder="0"
                
                allowFullScreen
                style={{
                height: "100%",
                }}
            ></iframe>
                </div>
            
            </div>
        </div>
        <HowToPlay />
        <GameTips />
        <Footer /> 
        </div>
        
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
