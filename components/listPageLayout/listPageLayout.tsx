import Head from "next/head";
import styles from "./layout.module.css";

export default function ListPageLayout({
  children,
  createNewElement,
  title,
}: {
  children: React.ReactNode;
  createNewElement?: JSX.Element;
  title: string;
}) {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
      </Head>

      <div className={styles.header}>
        <h1>{title}</h1>
        {createNewElement}
      </div>

      {children}
    </div>
  );
}
