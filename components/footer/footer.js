import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logoGroup}>
          <Image 
          src="/youCoinsLogo.png"
        width={100}
        height={100}
        alt="Picture of the author"
        />
            <span className={styles.brand}>Youtube Collect</span>
          </div>

          <div className={styles.links}>
            <a href="#" className={styles.link}>Terms</a>
            <a href="#" className={styles.link}>Privacy</a>
            <a href="#" className={styles.link}>Contact</a>
          </div>

          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} Youtube Collect
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
