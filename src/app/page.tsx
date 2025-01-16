import Image from "next/image";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen ">

      <section className="text-center mt-8">
        <h1 className="text-4xl font-bold mb-4 text-blue-500">Welcome to Project Collaboration Tool </h1>
        <p className="text-lg">Stay Organized, Be Productive, Achieve More!</p>
        <div className="flex justify-center mt-8 rounded-lg  overflow-hidden pt-20 mb-8">
          <Image
            src="/tasks.png"
            alt="Task image"
            width={400}
            height={200}
          />
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-bold mb-4">Plan your tasks, achieve your goals</h2>
      </section>
      <Footer />
    </main>


  );
}
