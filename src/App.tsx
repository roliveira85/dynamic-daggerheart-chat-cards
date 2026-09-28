import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ProblemSection from './components/ProblemSection'
import SolutionSection from './components/SolutionSection'
import FeaturesSection from './components/FeaturesSection'
import ArchitectureSection from './components/ArchitectureSection'
import CodeViewer from './components/CodeViewer'
import InstallSection from './components/InstallSection'
import Footer from './components/Footer'

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview')

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-gray-100 font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === 'overview' && (
          <>
            <Hero />
            <ProblemSection />
            <SolutionSection />
            <FeaturesSection />
          </>
        )}
        {activeTab === 'architecture' && <ArchitectureSection />}
        {activeTab === 'code' && <CodeViewer />}
        {activeTab === 'install' && <InstallSection />}
      </main>
      <Footer />
    </div>
  )
}
