import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { 
  Database, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize, 
  ExternalLink,
  RefreshCw,
  Server,
  Terminal,
  Building,
  CheckCircle2,
  X,
  Search,
  Star,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  ChevronDown,
  User,
  Plus,
  Info
} from 'lucide-react'
import './App.css'

const translations = {
  home: "Home",
  badge: "The Future of Luxury Living",
  heroTitle: "Discover Your Ultimate Dream Living Space",
  heroSubtitle: "Experience bespoke premium real estate with integrated Supabase diagnostics, modern architectural masterpieces, and automated client concierge tools.",
  filterLocation: "Location",
  filterLocationPlaceholder: "Search location...",
  filterType: "Property Type",
  filterPrice: "Price Range",
  all: "All",
  searchTooltip: "Search properties",
  statsAwardsVal: "150+",
  statsAwardsLbl: "Award Wins",
  statsClientsVal: "2.5k+",
  statsClientsLbl: "Happy Clients",
  statsSoldVal: "180+",
  statsSoldLbl: "Properties Sold",
  featuredTitle: "Featured Premium Residences",
  featuredSubtitle: "Explore our handpicked collection of elite architectural marvels boasting state-of-the-art automation and high-end materials.",
  beds: "Beds",
  baths: "Baths",
  area: "Area",
  viewDetails: "View Details",
  servicesTitle: "Exquisite Real Estate Services",
  servicesSubtitle: "Bespoke offerings curated to provide a seamless transition to your new architectural sanctuary.",
  service1Title: "AI Valuations",
  service1Desc: "Receive real-time property market valuation diagnostics powered by localized pricing indexes.",
  service2Title: "Virtual 3D Tours",
  service2Desc: "Walk through premium penthouses and seaside villas in high fidelity from anywhere in the world.",
  service3Title: "Supabase Backup",
  service3Desc: "Rest easy knowing all structural logs and inquiries are securely stored with row-level security.",
  service4Title: "Luxury Curators",
  service4Desc: "Connect with elite verified architectural advisors to custom build or modify your properties.",
  testimonialsTitle: "Acclaimed Client Whispers",
  testimonialsSubtitle: "Hear from distinguished business leaders and investors who discovered their sanctuary through Treeivo.",
  t1User: "Alexandra DuPont",
  t1Title: "Tech Investor, Paris",
  t1Text: "Treeivo completely changed our property acquisition experience. The Virtual 3D Tours saved us months of travel, and the transaction was seamless.",
  t2User: "Marcus Vance",
  t2Title: "Software Architect, Tokyo",
  t2Text: "The developer integration interface is a breath of fresh air. Running database diagnostics and testing API schema while shopping for a penthouse is genius!",
  t3User: "Sophia Sterling",
  t3Title: "Principal, Sterling Design",
  t3Text: "Uncompromising attention to architectural detail. Every property listed here is a unique piece of modern design. Absolutely thrilled with our Waterfront Manor.",
  contactTitle: "Begin Your Journey With Treeivo",
  contactSubtitle: "Get in touch with our expert concierge brokers to coordinate a private showing or review land title certificates.",
  fullName: "Full Name",
  emailAddr: "Email Address",
  phoneNum: "Phone Number",
  message: "Message",
  sendMsg: "Send Message",
  sendingMsg: "Sending Request...",
  msgSuccess: "✓ Thank you! Our advisor will contact you shortly.",
  footerDesc: "Next-generation elite real estate catalog and Supabase-connected architecture diagnostic suite.",
  footerCol1: "Residences",
  footerCol2: "Company",
  villas: "Villas",
  apartments: "Apartments",
  penthouses: "Penthouses",
  townhouses: "Townhouses",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  copyright: "Treeivo Luxury Property. All rights reserved.",
  modalOverview: "Property Overview",
  modalAgent: "Resident Agent",
  modalSchedule: "Schedule a Private Viewing",
  confirmInquiry: "Confirm Request",
  sendingInquiry: "Sending...",
  inquirySuccessMsg: "✓ Inquiry successfully registered!",
  devConsole: "Developer Console",
  connectionStatus: "Connection Status",
  checked: "Checked",
  logs: "Logs",
  dbInquiries: "DB Inquiries",
  addProperty: "Add Property",
  clearLogs: "Clear Logs"
}

function App() {
  // Global States
  const [properties, setProperties] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [connectionStatus, setConnectionStatus] = useState('checking') // checking, connected, error
  const [logs, setLogs] = useState([])

  const tText = (key) => {
    return translations[key] || key
  }

  const getPropText = (prop, field) => {
    if (!prop) return ''
    let val = prop[field] || ''
    if (typeof val === 'string') {
      val = val.replace(/Dream Zone/g, 'Treeivo')
    }
    return val
  }

  const formatPrice = (price) => {
    return price || ''
  }

  const formatNumber = (num) => {
    if (num === undefined || num === null) return ''
    return String(num)
  }
  
  // Theme State locked to light mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
  }, [])
  
  // UI Control States
  const [showDevConsole, setShowDevConsole] = useState(false)
  const [activeDevTab, setActiveDevTab] = useState('logs') // logs, inquiries
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0)
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileProjectOpen, setMobileProjectOpen] = useState(false)
  
  const [activeLocationIdx, setActiveLocationIdx] = useState(0)

  const mapLocations = [
    {
      name: "DHAKA WESTERN VALLEY",
      query: "Dhaka Western Valley",
      link: "https://maps.app.goo.gl/3TFvoVH69AhLMuYMA",
      desc: "Exclusive planned plotted residential neighborhood with modern infrastructure."
    },
    {
      name: "The Bay Icon Hotel & Resort",
      query: "The Bay Icon Cox's Bazar",
      link: "https://maps.app.goo.gl/3htzPPkRE5udY5kD9",
      desc: "Premium luxury waterfront hotel & resort along Cox's Bazar Marine Drive."
    },
    {
      name: "Pushpodhara Eco-City",
      query: "Pushpodhara Eco-City",
      link: "https://maps.app.goo.gl/qPbnSHyovpjXLVw37",
      desc: "Sustainable eco-friendly plotted community prioritizing green living and premium facilities."
    },
    {
      name: "Pushpo Satellite City",
      query: "Pushpo Satellite City",
      link: "https://maps.app.goo.gl/Qwt2Jbno6jXUfcx18",
      desc: "A fully developed smart satellite township with integrated utilities and green spaces."
    },
    {
      name: "Pushpo Homes luxurious condominium city",
      query: "Pushpo Homes luxurious condominium city",
      link: "https://maps.app.goo.gl/379QnLEWkVxJ6Evx8",
      desc: "High-end residential high-rise luxury condominium township with resort-style amenities."
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIdx(prev => (prev + 1) % 3)
    }, 8500)
    return () => clearInterval(timer)
  }, [currentHeroIdx])
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false)
  
  // Search Filter State
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    type: 'All',
    priceRange: 'All'
  })

  // Booking Form State (inside Property Detail Modal)
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submittingInquiry, setSubmittingInquiry] = useState(false)
  const [inquirySuccess, setInquirySuccess] = useState(false)

  // General Contact Form State
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)

  // Add Property Form State
  const [newPropertyFormData, setNewPropertyFormData] = useState({
    title: '',
    location: '',
    price: '',
    beds: '3',
    baths: '2',
    area: '',
    type: 'Apartment',
    status: 'Available',
    image_url: '',
    description: '',
    featured: false,
    rating: '4.5',
    agent_name: 'Sarah Jenkins',
    agent_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  })

  // Credentials for display in diagnostic
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qofnaitxmcvlbmmlddoz.supabase.co'
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-_Onl9NuvkEcD8VWH2bOFQ_bQb9_O-Z'

  // Diagnostic Logs helper
  const addLog = (text, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { time: timestamp, text, type }])
  }

  // Scroll detection for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHeaderScrolled(true)
      } else {
        setHeaderScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Secret Keyboard Shortcut to open developer diagnostics (Ctrl + Shift + D)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        setShowDevConsole(prev => {
          if (!prev) {
            checkConnectionAndFetch()
          }
          return !prev
        })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Check Supabase Connection and Fetch Data
  const checkConnectionAndFetch = async () => {
    setConnectionStatus('checking')
    addLog('Initiating connection diagnostic to Supabase...', 'info')
    addLog(`Targeting endpoint: ${supabaseUrl}`, 'info')

    try {
      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (propertiesError) {
        if (propertiesError.message && propertiesError.message.includes("Could not find the table")) {
          setConnectionStatus('error')
          addLog('✗ DB Schema error: Table "properties" does not exist in schema cache.', 'error')
          addLog('Recommendation: Create tables using SQL Migration reference.', 'info')
        } else {
          setConnectionStatus('error')
          addLog(`✗ Query error: ${propertiesError.message}`, 'error')
        }
        // Load fallback properties for premium experience preview
        loadFallbacks()
      } else {
        setConnectionStatus('connected')
        addLog('✓ Connection Established! Tables synced.', 'success')
        addLog(`Retrieved ${propertiesData.length || 0} active listings.`, 'success')
        setProperties(propertiesData || [])
      }

      // Fetch inquiries
      const { data: inquiriesData, error: inquiriesError } = await supabase
        .from('inquiries')
        .select('*, properties(title)')
        .order('created_at', { ascending: false })

      if (!inquiriesError && inquiriesData) {
        setInquiries(inquiriesData)
        addLog(`Synchronized ${inquiriesData.length} client inquiries.`, 'success')
      }

    } catch (err) {
      setConnectionStatus('error')
      addLog(`✗ Connection Exception: ${err.message}`, 'error')
      loadFallbacks()
    }
  }

  const loadFallbacks = () => {
    addLog('Loading high-fidelity client-side properties catalog as fallback.', 'info')
    setProperties([
      {
        id: 'fallback-1',
        title: 'The Grand Zenith Villa',
        location: 'Sunset Hills, Treeivo',
        price: '$1,200,000',
        beds: 5,
        baths: 6,
        area: '4,200 sqft',
        type: 'Villa',
        status: 'Premium',
        image_url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
        description: 'An architectural masterpiece offering panoramic ocean views, private infinity pool, state-of-the-art smart home automation, and an expansive outdoor terrace perfect for grand scale entertaining.',
        featured: true,
        rating: 4.9,
        agent_name: 'Sarah Jenkins',
        agent_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 'fallback-2',
        title: 'Aura Premium Heights',
        location: 'Sector 4, Treeivo City',
        price: '$450,000',
        beds: 3,
        baths: 3,
        area: '1,850 sqft',
        type: 'Apartment',
        status: 'Available',
        image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        description: 'Stunning modern apartment featuring double-height floor-to-ceiling windows, high-end European kitchen appliances, a spacious master suite, and exclusive access to the sky lounge and fitness center.',
        featured: true,
        rating: 4.7,
        agent_name: 'David Chen',
        agent_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 'fallback-3',
        title: 'Neo-Eco Smart Townhouse',
        location: 'Greenwood Valley',
        price: '$320,000',
        beds: 2,
        baths: 2.5,
        area: '1,350 sqft',
        type: 'Townhouse',
        status: 'New',
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        description: 'Eco-friendly townhouse designed for modern energy efficiency. Features rooftop solar panels, rainwater harvesting, dual-zone climate control, and a cozy private backyard garden.',
        featured: false,
        rating: 4.5,
        agent_name: 'Marcus Miller',
        agent_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 'fallback-4',
        title: 'Lumina Glass Penthouse',
        location: 'Downtown Sky-Line',
        price: '$1,850,000',
        beds: 4,
        baths: 4.5,
        area: '3,100 sqft',
        type: 'Penthouse',
        status: 'Premium',
        image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
        description: 'Suspended in the clouds, this ultra-luxurious penthouse features a Private Heli-pad access, 360-degree skyline views, personal glass elevator, wine cellar, and 24/7 white-glove concierge service.',
        featured: true,
        rating: 5.0,
        agent_name: 'Sarah Jenkins',
        agent_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 'fallback-5',
        title: 'Serene Waterfront Manor',
        location: 'Cove Island, Treeivo',
        price: '$2,100,000',
        beds: 6,
        baths: 7,
        area: '6,500 sqft',
        type: 'Villa',
        status: 'Available',
        image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        description: 'Nestled on a private peninsula, this waterfront estate boasts a private deep-water dock, sandy beach, guest guest-house, home cinema, and beautifully manicured formal gardens.',
        featured: false,
        rating: 4.8,
        agent_name: 'David Chen',
        agent_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 'fallback-6',
        title: 'Moderna Industrial Loft',
        location: 'Arts District',
        price: '$280,000',
        beds: 1,
        baths: 1.5,
        area: '980 sqft',
        type: 'Apartment',
        status: 'New',
        image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        description: 'Chic loft space featuring authentic exposed brick walls, polished concrete flooring, industrial structural beams, custom steel staircases, and an open-concept living area.',
        featured: false,
        rating: 4.3,
        agent_name: 'Marcus Miller',
        agent_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      }
    ])
  }

  useEffect(() => {
    checkConnectionAndFetch()
  }, [])

  // Handle Booking Viewings inside Detail Modal
  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!bookingFormData.name || !bookingFormData.email) {
      alert('Please fill in your name and email.')
      return
    }
    setSubmittingInquiry(true)
    addLog(`Inserting new inquiry for property: ${selectedProperty.title}...`, 'info')

    try {
      // Check if it is a real DB uuid or a fallback key
      const propertyIdForDb = selectedProperty.id.startsWith('fallback-') ? null : selectedProperty.id

      const { data, error } = await supabase
        .from('inquiries')
        .insert([
          {
            property_id: propertyIdForDb,
            name: bookingFormData.name,
            email: bookingFormData.email,
            phone: bookingFormData.phone,
            message: bookingFormData.message || `Hi, I am interested in scheduling a viewing for "${selectedProperty.title}".`
          }
        ])
        .select()

      if (error) {
        addLog(`DB Insert Inquiry failed: ${error.message}. Simulated success client-side.`, 'error')
      } else {
        addLog('✓ Inquiry successfully synchronized to Supabase database!', 'success')
        // Refresh inquiries
        const { data: newInquiries } = await supabase
          .from('inquiries')
          .select('*, properties(title)')
          .order('created_at', { ascending: false })
        if (newInquiries) setInquiries(newInquiries)
      }

      setInquirySuccess(true)
      setBookingFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      addLog(`Inquiry insert exception: ${err.message}`, 'error')
      setInquirySuccess(true)
    } finally {
      setSubmittingInquiry(false)
    }
  }

  // Handle General Contact Form Submit
  const handleContactSubmit = async (e) => {
    e.preventDefault()
    if (!contactFormData.name || !contactFormData.email) return

    setContactSubmitting(true)
    addLog(`General contact inquiry from: ${contactFormData.name}...`, 'info')

    try {
      const { data, error } = await supabase
        .from('inquiries')
        .insert([
          {
            name: contactFormData.name,
            email: contactFormData.email,
            phone: contactFormData.phone,
            message: contactFormData.message
          }
        ])

      if (error) {
        addLog(`DB General contact failed: ${error.message}. Simulated success client-side.`, 'error')
      } else {
        addLog('✓ Contact Inquiry logged in Database.', 'success')
        // Refresh inquiries
        const { data: newInquiries } = await supabase
          .from('inquiries')
          .select('*, properties(title)')
          .order('created_at', { ascending: false })
        if (newInquiries) setInquiries(newInquiries)
      }
      setContactSuccess(true)
      setContactFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setContactSuccess(true)
    } finally {
      setContactSubmitting(false)
    }
  }

  // Handle Adding New Property (Developer Tool)
  const handleAddPropertySubmit = async (e) => {
    e.preventDefault()
    if (!newPropertyFormData.title || !newPropertyFormData.price || !newPropertyFormData.location) {
      addLog('Validation Error: Required fields missing.', 'error')
      return
    }

    const priceNum = newPropertyFormData.price.startsWith('$') 
      ? newPropertyFormData.price 
      : `$${Number(newPropertyFormData.price).toLocaleString()}`

    const finalPropertyData = {
      ...newPropertyFormData,
      price: priceNum,
      beds: Number(newPropertyFormData.beds),
      baths: Number(newPropertyFormData.baths),
      image_url: newPropertyFormData.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    }

    addLog(`Inserting new property listing: "${finalPropertyData.title}"...`, 'info')

    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([finalPropertyData])
        .select()

      if (error) {
        addLog(`DB Property insert failed: ${error.message}. Creating locally.`, 'error')
        const fallbackProperty = {
          id: `local-${Date.now()}`,
          ...finalPropertyData
        }
        setProperties(prev => [fallbackProperty, ...prev])
      } else {
        addLog('✓ Property successfully synchronized to Supabase!', 'success')
        setProperties(prev => [data[0], ...prev])
      }

      setShowAddPropertyModal(false)
      // reset form
      setNewPropertyFormData({
        title: '',
        location: '',
        price: '',
        beds: '3',
        baths: '2',
        area: '',
        type: 'Apartment',
        status: 'Available',
        image_url: '',
        description: '',
        featured: false,
        rating: '4.5',
        agent_name: 'Sarah Jenkins',
        agent_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
      })
    } catch (err) {
      addLog(`Exception inserting property: ${err.message}`, 'error')
    }
  }

  // Filter listings based on tabs and search filters
  const getFilteredProperties = () => {
    return properties.filter(item => {
      // 1. Tab Type Filter
      if (selectedTypeFilter !== 'All' && item.type !== selectedTypeFilter) return false

      // 2. Search Text Location Filter
      if (searchFilters.location && !item.location.toLowerCase().includes(searchFilters.location.toLowerCase()) && !item.title.toLowerCase().includes(searchFilters.location.toLowerCase())) {
        return false
      }

      // 3. Search Dropdown Type Filter
      if (searchFilters.type !== 'All' && item.type !== searchFilters.type) return false

      // 4. Search Price Range Filter
      if (searchFilters.priceRange !== 'All') {
        const rawPrice = parseInt(item.price.replace(/[^0-9]/g, ''), 10)
        if (searchFilters.priceRange === 'under-500k' && rawPrice >= 500000) return false
        if (searchFilters.priceRange === '500k-1m' && (rawPrice < 500000 || rawPrice > 1000000)) return false
        if (searchFilters.priceRange === 'over-1m' && rawPrice <= 1000000) return false
      }

      return true
    })
  }

  const getCategoryLabel = (cat) => {
    return cat === 'All' ? 'All' : `${cat}s`
  }

  const projectDetails = {
    'Dhaka Western Valley': {
      id: 'fallback-project-dwv',
      title: 'Dhaka Western Valley Villa',
      location: 'Sector 5, Dhaka Western Valley',
      price: '$750,000',
      beds: 4,
      baths: 4,
      area: '2,800 sqft',
      type: 'Villa',
      status: 'Exclusive',
      image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      description: 'A beautiful luxury villa situated in the heart of Dhaka Western Valley. Features custom landscaping, eco-smart ventilation, and premium interior elements.',
      featured: true,
      rating: 4.8,
      agent_name: 'David Chen',
      agent_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    'The Bay Icon': {
      id: 'fallback-project-tbi',
      title: 'The Bay Icon Marina Penthouse',
      location: 'Bay Waterfront, The Bay Icon',
      price: '$2,450,000',
      beds: 5,
      baths: 6,
      area: '5,100 sqft',
      type: 'Penthouse',
      status: 'Exclusive',
      image_url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      description: 'The pinnacle of luxury living. Overlooking the marine docks, this penthouse features high-end European marble, automated yacht docking service, and private concierge.',
      featured: true,
      rating: 5.0,
      agent_name: 'David Chen',
      agent_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    'Pushpo Condominium City': {
      id: 'fallback-project-pcc',
      title: 'Pushpo Condominium City Luxury Complex',
      location: 'Road 4, Pushpo Condominium City',
      price: '$890,000',
      beds: 4,
      baths: 4.5,
      area: '3,200 sqft',
      type: 'Apartment',
      status: 'Premium',
      image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      description: 'Ultra-modern residential condominium located in Pushpo Condominium City. Features an Olympic-sized infinity pool, sky-lounge recreation center, wellness spa, and round-the-clock security.',
      featured: true,
      rating: 4.9,
      agent_name: 'Sarah Jenkins',
      agent_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    }
  }

  const handleProjectSelect = (projectName) => {
    const exists = properties.some(p => p.location.includes(projectName))
    if (!exists && projectDetails[projectName]) {
      const mockProp = {
        id: `mock-project-${Date.now()}`,
        ...projectDetails[projectName]
      }
      setProperties(prev => [mockProp, ...prev])
    }

    setSearchFilters(prev => ({
      ...prev,
      location: projectName,
      type: 'All',
      priceRange: 'All'
    }))
    
    document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const catalogProperties = getFilteredProperties()

  return (
    <div className="app-container">
      <div className="bg-glow-orb-1" />
      <div className="bg-glow-orb-2" />

      {/* Navigation Bar */}
      <header className={`landing-header ${headerScrolled ? 'scrolled' : ''}`}>
        <a href="#" className="brand-logo-section">
          <img src="/Logo.png" alt="Treeivo Logo" className="brand-logo-image" />
        </a>

        {/* Hamburger Button - Mobile Only */}
        <button
          className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <ul className="nav-menu">
            <li><a href="#" className="nav-link active">{tText('home')}</a></li>
            <li className="nav-item-dropdown">
              <a href="#" className="nav-dropdown-btn" onClick={(e) => e.preventDefault()}>
                PROJECT <ChevronDown size={14} className="dropdown-arrow" />
              </a>
              <ul className="dropdown-menu">
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleProjectSelect('Dhaka Western Valley'); }}>Dhaka Western Valley</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleProjectSelect('The Bay Icon'); }}>The Bay Icon</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleProjectSelect('Pushpo Condominium City'); }}>Pushpo Condominium City</a></li>
              </ul>
            </li>
            <li><a href="#feasibility" className="nav-link" onClick={(e) => { e.preventDefault(); document.getElementById('feasibility')?.scrollIntoView({ behavior: 'smooth' }); }}>Feasibility Study</a></li>
            <li><a href="#gallery" className="nav-link" onClick={(e) => { e.preventDefault(); document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' }); }}>Gallery</a></li>
            <li><a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); document.getElementById('who-we-are')?.scrollIntoView({ behavior: 'smooth' }); }}>About</a></li>
          </ul>
        </nav>

        {/* Mobile Drawer Overlay */}
        <div className={`mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)} />

        {/* Mobile Nav Drawer */}
        <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <button className="drawer-close-btn" onClick={() => setMobileMenuOpen(false)}>
            <X size={24} />
          </button>
          
          <a href="tel:+8801815311232" className="drawer-call-btn">
            <Phone size={14} /> Call for Schedule
          </a>

          <ul className="drawer-nav-menu">
            <li><a href="#" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
            <li className={`drawer-nav-dropdown ${mobileProjectOpen ? 'open' : ''}`}>
              <div 
                className="drawer-dropdown-toggle" 
                onClick={() => setMobileProjectOpen(!mobileProjectOpen)}
              >
                <span>Project</span> 
                <ChevronDown 
                  size={16} 
                  className={`drawer-chevron ${mobileProjectOpen ? 'rotate' : ''}`}
                  style={{ transition: 'transform 0.3s ease', transform: mobileProjectOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </div>
              <ul 
                className="drawer-dropdown-menu"
                style={{
                  maxHeight: mobileProjectOpen ? '200px' : '0',
                  overflow: 'hidden',
                  paddingTop: mobileProjectOpen ? '10px' : '0',
                  paddingBottom: mobileProjectOpen ? '10px' : '0',
                  transition: 'all 0.3s ease-in-out',
                  opacity: mobileProjectOpen ? 1 : 0
                }}
              >
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleProjectSelect('Dhaka Western Valley'); setMobileMenuOpen(false); }}>Dhaka Western Valley</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleProjectSelect('The Bay Icon'); setMobileMenuOpen(false); }}>The Bay Icon</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleProjectSelect('Pushpo Condominium City'); setMobileMenuOpen(false); }}>Pushpo Condominium City</a></li>
              </ul>
            </li>
            <li><a href="#feasibility" className="drawer-nav-link" onClick={(e) => { e.preventDefault(); document.getElementById('feasibility')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}>Feasibility Study</a></li>
            <li><a href="#gallery" className="drawer-nav-link" onClick={(e) => { e.preventDefault(); document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}>Gallery</a></li>
            <li><a href="#about" className="drawer-nav-link" onClick={(e) => { e.preventDefault(); document.getElementById('who-we-are')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}>About</a></li>
          </ul>

          <div className="drawer-footer">
            <div className="drawer-contact-item">
              <Phone size={14} /> +88 01815 311 232
            </div>
            <div className="drawer-contact-item">
              <Mail size={14} /> info@treeivo.com
            </div>
            
            <div className="drawer-socials-container">
              <p>Follow Us:</p>
              <div className="drawer-socials">
                <a href="#" className="drawer-social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" className="drawer-social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                </a>
                <a href="#" className="drawer-social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <a href="tel:+8801815311232" className="header-call-btn">
          <Phone size={14} /> Call for Schedule
        </a>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        {/* Background Slideshow */}
        <div className="hero-slideshow-container">
          {[
            { img: '/Hero-1.jpg' },
            { img: '/Hero-2.png' },
            { img: '/Hero-3.jpeg' }
          ].map((slide, idx) => {
            let slideStatus = '';
            if (currentHeroIdx === idx) {
              slideStatus = 'active';
            } else if ((currentHeroIdx + 1) % 3 === idx) {
              slideStatus = 'next';
            } else {
              slideStatus = 'prev';
            }
            return (
              <div key={idx} className={`hero-slide ${slideStatus}`}>
                <div 
                  className="hero-slide-bg" 
                  style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 40%), url('${slide.img}')` }} 
                />
              </div>
            );
          })}
        </div>

        {/* Book an Appointment Button */}
        <a 
          href="#contact" 
          className="hero-appointment-btn"
          onClick={(e) => { 
            e.preventDefault(); 
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); 
          }}
        >
          Book an Appointment
        </a>

        {/* Modern Vertical Slide Indicators Navigation */}
        <div className="hero-slide-nav">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              className={`hero-nav-dot ${currentHeroIdx === idx ? 'active' : ''}`}
              onClick={() => setCurrentHeroIdx(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span className="dot-center" />
            </button>
          ))}
        </div>
      </section>

      {/* WHO WE ARE SECTION */}
      <section className="about-section" id="about">
        <div className="about-container">
          <div className="about-content">
            <h2 className="about-title">WHO WE ARE</h2>
            <div className="about-divider" />
            <p className="about-text">
              We are a trusted real estate company specializing in residential and commercial plots. 
              Our mission is to provide premium properties at competitive prices through a transparent, 
              efficient, and customer-focused approach. With integrity, expertise, and exceptional service, 
              we help our clients invest with confidence and build a better future.
            </p>
            <div className="about-features">
              <div className="about-feature">
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">✓</span>
                </div>
                <div className="feature-text-block">
                  <h4>Premium Properties</h4>
                  <p>Hand-picked residential & commercial plots in prime locations.</p>
                </div>
              </div>
              <div className="about-feature">
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">✓</span>
                </div>
                <div className="feature-text-block">
                  <h4>Transparent Approach</h4>
                  <p>Complete clarity in documentation, pricing, and transactions.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="about-image-wrapper">
            <img src="/who-we-are.png" alt="Who We Are" className="about-image" />
            <div className="about-image-border" />
          </div>
        </div>
      </section>

      {/* BUILDING DEVELOPMENT SECTION */}
      <section className="development-section" id="development">
        <div className="development-container">
          <div className="development-image-wrapper">
            <img src="/building-development.png" alt="Building Development" className="development-image" />
            <div className="development-image-accent" />
          </div>
          <div className="development-content">
            <h2 className="development-title">Building Development</h2>
            <div className="development-divider" />
            <p className="development-text">
              At <strong>Terrivo</strong>, we develop modern, sustainable, and future-ready residential and commercial projects that combine innovative design with exceptional construction quality.
            </p>
            <p className="development-text">
              Our developments are thoughtfully planned to deliver comfort, functionality, safety, and long-term value while meeting the evolving needs of homeowners, businesses, and investors.
            </p>
            <p className="development-text">
              From premium residential communities to commercial developments and mixed-use projects, we are committed to creating inspiring spaces that enhance lifestyles, support business growth, and stand as lasting landmarks for generations.
            </p>
            
            <div className="development-metrics">
              <div className="metric-box">
                <span className="metric-num">A+</span>
                <span className="metric-lbl">Build Quality</span>
              </div>
              <div className="metric-box">
                <span className="metric-num">100%</span>
                <span className="metric-lbl">Sustainable</span>
              </div>
              <div className="metric-box">
                <span className="metric-num">Modern</span>
                <span className="metric-lbl">Architecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LAND DEVELOPMENT SECTION */}
      <section className="land-development-section" id="land-development">
        <div className="land-development-container">
          <div className="land-development-content">
            <h2 className="land-development-title">Land Development</h2>
            <div className="land-development-divider" />
            <p className="land-development-text">
              At <strong>Terrivo</strong>, we transform raw land into well-planned, fully developed communities with modern infrastructure and sustainable planning.
            </p>
            <p className="land-development-text">
              Our land development projects feature premium residential and commercial plots, thoughtfully designed road networks, utility services, green spaces, and eco-friendly amenities that create lasting value.
            </p>
            <p className="land-development-text">
              Every project is strategically developed to ensure legal compliance, construction readiness, and strong investment potential—providing individuals, families, and businesses with secure opportunities for future growth and long-term returns.
            </p>
            
            <div className="land-development-metrics">
              <div className="land-metric-box">
                <span className="land-metric-num">Approved</span>
                <span className="land-metric-lbl">Legal Status</span>
              </div>
              <div className="land-metric-box">
                <span className="land-metric-num">Eco</span>
                <span className="land-metric-lbl">Smart Greenery</span>
              </div>
              <div className="land-metric-box">
                <span className="land-metric-num">Prime</span>
                <span className="land-metric-lbl">Locations</span>
              </div>
            </div>
          </div>
          <div className="land-development-image-wrapper">
            <img src="/land-development.png" alt="Land Development" className="land-development-image" />
            <div className="land-development-image-accent" />
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS SECTION */}
      <section className="featured-projects-section" id="featured-projects">
        <div className="featured-projects-header">
          <span className="featured-projects-tag">EXCLUSIVE PORTFOLIO</span>
          <h2 className="featured-projects-title">Featured Projects</h2>
          <div className="featured-projects-divider" />
        </div>
        <div className="featured-projects-grid">
          <div className="project-card">
            <div className="project-card-image-wrapper">
              <img src="/Dhaka Western Valley.jpeg" alt="Dhaka Western Valley" className="project-card-image" />
              <div className="project-card-overlay">
                <div className="project-card-info">
                  <span className="project-category">Plotted Development</span>
                  <h3>Dhaka Western Valley</h3>
                  <p>A secure, premium residential community offering modern infrastructure and serene environment.</p>
                  <a href="#contact" className="project-card-link">Learn More <ChevronRight size={16} /></a>
                </div>
              </div>
            </div>
          </div>
          <div className="project-card">
            <div className="project-card-image-wrapper">
              <img src="/the Bay Icon.jpeg" alt="The Bay Icon" className="project-card-image" />
              <div className="project-card-overlay">
                <div className="project-card-info">
                  <span className="project-category">Waterfront Residences</span>
                  <h3>The Bay Icon</h3>
                  <p>Ultra-luxury high-rise residential masterpiece designed with modern architectural excellence.</p>
                  <a href="#contact" className="project-card-link">Learn More <ChevronRight size={16} /></a>
                </div>
              </div>
            </div>
          </div>
          <div className="project-card">
            <div className="project-card-image-wrapper">
              <img src="/Pushpo Eco City.jpeg" alt="Pushpo Eco City" className="project-card-image" />
              <div className="project-card-overlay">
                <div className="project-card-info">
                  <span className="project-category">Eco-Friendly Development</span>
                  <h3>Pushpo Eco City</h3>
                  <p>Thoughtfully planned sustainable green community prioritizing wellness and clean environment.</p>
                  <a href="#contact" className="project-card-link">Learn More <ChevronRight size={16} /></a>
                </div>
              </div>
            </div>
          </div>
          <div className="project-card">
            <div className="project-card-image-wrapper">
              <img src="/Pushpo Satellite City.jpeg" alt="Pushpo Satellite City" className="project-card-image" />
              <div className="project-card-overlay">
                <div className="project-card-info">
                  <span className="project-category">Smart Satellite Town</span>
                  <h3>Pushpo Satellite City</h3>
                  <p>Modern residential and commercial city equipped with high-tech utilities and features.</p>
                  <a href="#contact" className="project-card-link">Learn More <ChevronRight size={16} /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* CONTACT GENERAL SECTION */}
      <section className="contact-section" id="contact">
        <div className="contact-container">
          <div className="contact-info-panel">
            <h2 className="contact-info-title">
              Begin Your Journey <br />With Terrivo
            </h2>
            <p className="contact-info-desc">
              Get in touch with our expert concierge brokers to coordinate a private showing or review land title certificates.
            </p>

            <div className="contact-details-list">
              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <Phone size={20} />
                </div>
                <div className="contact-detail-content">
                  <h4>Mobile</h4>
                  <p><a href="tel:+8801815311232" style={{ color: 'inherit', textDecoration: 'none' }}>+8801815311232</a></p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-detail-content">
                  <h4>Email</h4>
                  <p><a href="mailto:info@treeivo.com" style={{ color: 'inherit', textDecoration: 'none' }}>info@treeivo.com</a></p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <MapPin size={20} />
                </div>
                <div className="contact-detail-content">
                  <h4>Address</h4>
                  <p>Gemcon Business Center, Level-7 & 8, 255 New Circular Road, Dhaka – 1217</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-card">
            {contactSuccess ? (
              <div className="success-container">
                <CheckCircle2 size={48} className="success-icon" />
                <h3 className="success-title">Message Logs Received</h3>
                <p className="success-desc">Our lead broker will verify your contact coordinates and follow up shortly.</p>
                <button className="btn-send-message" onClick={() => setContactSuccess(false)}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="booking-form">
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, margin: '0 0 10px 0' }}>Send us a message</h3>
                
                <div className="input-row">
                  <div className="form-group">
                    <label className="form-label">{tText('fullName')} *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Rahat Rahman"
                      value={contactFormData.name}
                      onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{tText('emailAddr')} *</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="e.g. rahat@email.com"
                      value={contactFormData.email}
                      onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{tText('phoneNum')}</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="e.g. +880 1712-345678"
                    value={contactFormData.phone}
                    onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{tText('message')} *</label>
                  <textarea 
                    className="form-input" 
                    style={{ minHeight: 120, resize: 'vertical' }}
                    placeholder="Write your message here... (e.g., plot size, pricing details, booking inquiries)"
                    value={contactFormData.message}
                    onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn-send-message" style={{ width: '100%', marginTop: 10 }} disabled={contactSubmitting}>
                  {contactSubmitting ? tText('sendingMsg') : tText('sendMsg')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* PROJECT LOCATIONS MAP SECTION */}
      <section className="map-section" id="project-locations">
        <div className="map-section-header">
          <span className="map-section-tag">GEOGRAPHIC REACH</span>
          <h2 className="map-section-title">Interactive Project Map</h2>
          <div className="map-section-divider" />
        </div>

        <div className="map-section-container">
          <div className="map-locations-list">
            {mapLocations.map((loc, idx) => (
              <div 
                key={idx} 
                className={`map-location-card ${activeLocationIdx === idx ? 'active' : ''}`}
                onClick={() => setActiveLocationIdx(idx)}
              >
                <div className="location-marker-dot" />
                <div className="location-card-info">
                  <h3>{loc.name}</h3>
                  <p>{loc.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="map-display-panel">
            <div className="map-iframe-wrapper">
              <iframe
                title={mapLocations[activeLocationIdx].name}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapLocations[activeLocationIdx].query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: 12 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="map-action-bar">
              <div className="active-location-meta">
                <MapPin size={18} className="meta-pin-icon" />
                <span>{mapLocations[activeLocationIdx].name}</span>
              </div>
              <a 
                href={mapLocations[activeLocationIdx].link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="map-nav-btn"
              >
                Open in Google Maps <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand-col">
            <a href="#" className="brand-logo-section">
              <img src="/Logo.png" alt="Treeivo Logo" className="brand-logo-image" />
            </a>
            <p>
              Our vision is to recharge the real‑estate experience with innovative, sustainable solutions that empower communities.
            </p>
            <div className="footer-socials">
              {/* Facebook */}
              <a href="#" className="social-icon-btn" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className="social-icon-btn" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                </svg>
              </a>
              {/* Email */}
              <a href="mailto:" className="social-icon-btn" aria-label="Email">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Partnership Column */}
          <div>
            <h4 className="footer-col-title">Partnership</h4>
            <div className="footer-partner-logos">
              <a href="#" className="footer-partner-logo-link">
                <img src="/btmbd.png" alt="BTM BD" className="footer-partner-logo" />
                <span className="footer-partner-name">Business Technology Marketing Limited</span>
              </a>
              <a href="#" className="footer-partner-logo-link">
                <img src="/Pushpodhara_logo.webp" alt="Pushpodhara" className="footer-partner-logo" />
                <span className="footer-partner-name">Pushpodhara Properties Ltd.</span>
              </a>
            </div>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="footer-col-title">Legal</h4>
            <ul className="footer-links">
              <li className="footer-link"><a href="#">Legal Documents</a></li>
              <li className="footer-link"><a href="#">Purchase Process</a></li>
              <li className="footer-link"><a href="#">Privacy Policy</a></li>
              <li className="footer-link"><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li className="footer-link"><a href="#who-we-are">About Us</a></li>
              <li className="footer-link"><a href="#">Become a Partner</a></li>
              <li className="footer-link"><a href="#">Referral Program</a></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Treeivo Luxury Property. All rights reserved.
          </p>
          <p style={{ display: 'flex', gap: 10 }}>

          </p>
        </div>
      </footer>

      {/* STUNNING PROPERTY DETAILS MODAL */}
      {selectedProperty && (
        <div className="premium-modal-overlay" onClick={() => setSelectedProperty(null)}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProperty(null)}>
              <X size={18} />
            </button>

            {/* Left side media block */}
            <div className="modal-left-media">
              <img 
                src={selectedProperty.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'} 
                alt={getPropText(selectedProperty, 'title')} 
                className="modal-large-img"
              />
              <div className="modal-img-overlay" />
              <div className="modal-media-content">
                <span className="property-type-tag" style={{ color: 'var(--accent-cyan)' }}>{getPropText(selectedProperty, 'type')}</span>
                <h2 className="modal-title">{getPropText(selectedProperty, 'title')}</h2>
                <div className="modal-price">{formatPrice(selectedProperty.price)}</div>
                <div className="modal-features-row">
                  <span>{formatNumber(selectedProperty.beds)} Bedrooms</span>
                  <span>•</span>
                  <span>{formatNumber(selectedProperty.baths)} Bathrooms</span>
                  <span>•</span>
                  <span>{getPropText(selectedProperty, 'area') || '1,800 sqft'}</span>
                </div>
              </div>
            </div>

            {/* Right side form and desc scroll area */}
            <div className="modal-right-scroll">
              <div className="modal-desc-section">
                <h3>Description</h3>
                <p className="modal-desc-text">
                  {getPropText(selectedProperty, 'description') || 'This beautifully designed luxury residence offers exceptional construction standards, highly bespoke details, smart integrations, and a magnificent layout built for modern contemporary living.'}
                </p>
              </div>

              <div className="modal-agent-section">
                <h3>Represented By</h3>
                <div className="agent-profile">
                  <img 
                    src={selectedProperty.agent_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'} 
                    alt={getPropText(selectedProperty, 'agent_name') || 'Sarah Jenkins'} 
                    className="agent-avatar"
                  />
                  <div>
                    <h4 className="agent-name">{getPropText(selectedProperty, 'agent_name') || 'Sarah Jenkins'}</h4>
                    <p className="agent-title">Senior Luxury Sales Associate</p>
                  </div>
                  <a href={`mailto:brokerage@dreamzone.property?subject=Inquiry: ${getPropText(selectedProperty, 'title')}`} className="btn-agent-contact">
                    Contact Email
                  </a>
                </div>
              </div>

              <div className="modal-booking-section">
                {inquirySuccess ? (
                  <div className="success-container" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 16 }}>
                    <CheckCircle2 size={36} className="success-icon" />
                    <h4 className="success-title">Viewing Requested!</h4>
                    <p className="success-desc" style={{ fontSize: 13, marginBottom: 0 }}>
                      Your ticket is active. Agent will contact you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="booking-form">
                    <h3>Schedule a Viewing</h3>
                    
                    <div className="form-group">
                      <label className="form-label">{tText('fullName')} *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Rahat Rahman"
                        value={bookingFormData.name}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{tText('emailAddr')} *</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="e.g. rahat@email.com"
                        value={bookingFormData.email}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{tText('phoneNum')}</label>
                      <input 
                        type="tel" 
                        className="form-input" 
                        placeholder="e.g. +880 1712-345678"
                        value={bookingFormData.phone}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn-premium" style={{ width: '100%', marginTop: 8 }} disabled={submittingInquiry}>
                      {submittingInquiry 
                        ? 'Booking Request Transmitting...' 
                        : 'Confirm Request'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEVELOPER DIAGNOSTIC DRAWER CONSOLE */}
      {showDevConsole && (
        <>
          <div className="dev-console-overlay" onClick={() => setShowDevConsole(false)} />
          <div className="dev-console-drawer">
            <div className="dev-console-header">
              <div className="dev-console-title">
                <Terminal size={20} className="text-cyan-400" />
                Developer Integration Portal
              </div>
              <button className="icon-btn" onClick={() => setShowDevConsole(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="dev-console-body">
              {/* Connection Status Card */}
              <div className="glass-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Server size={16} className="text-violet-400" />
                    <strong>Supabase Link</strong>
                  </div>
                  {connectionStatus === 'connected' && <span className="dev-badge-connected">✓ Connected</span>}
                  {connectionStatus === 'checking' && <span className="dev-badge-checking">⚡ Verifying...</span>}
                  {connectionStatus === 'error' && <span className="dev-badge-error">✗ Connection Error</span>}
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 12, wordBreak: 'break-all' }}>
                  URL: <code>{supabaseUrl}</code>
                </div>
              </div>

              {/* Console Tabs */}
              <div>
                <div className="tab-logs-inquiries-container">
                  <button 
                    className={`tab-logs-btn ${activeDevTab === 'logs' ? 'active' : ''}`}
                    onClick={() => setActiveDevTab('logs')}
                  >
                    Diagnostic Logs
                  </button>
                  <button 
                    className={`tab-logs-btn ${activeDevTab === 'inquiries' ? 'active' : ''}`}
                    onClick={() => { setActiveDevTab('inquiries'); checkConnectionAndFetch(); }}
                  >
                    Live Inquiries DB ({inquiries.length})
                  </button>
                </div>

                {activeDevTab === 'logs' ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>System diagnostic outputs:</span>
                      <button onClick={checkConnectionAndFetch} style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                        <RefreshCw size={12} /> Re-run Diagnostics
                      </button>
                    </div>

                    <div className="console-box" style={{ maxHeight: 300 }}>
                      {logs.map((log, index) => (
                        <div key={index} className="console-line">
                          <span className="console-time">[{log.time}]</span>
                          <span className={`console-text ${log.type}`}>{log.text}</span>
                        </div>
                      ))}
                      {logs.length === 0 && (
                        <div className="console-line">
                          <span className="console-time">[--:--:--]</span>
                          <span className="console-text info">Diagnostic stream empty. Trigger refresh to monitor.</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Live submissions in <code>public.inquiries</code>:</span>
                      <button onClick={checkConnectionAndFetch} style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                        <RefreshCw size={12} /> Sync Rows
                      </button>
                    </div>

                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                      {inquiries.map((inq) => (
                        <div key={inq.id} className="inquiry-list-item">
                          <div className="inquiry-header">
                            <span className="inquiry-name">{inq.name}</span>
                            <span className="inquiry-time">{new Date(inq.created_at).toLocaleTimeString()}</span>
                          </div>
                          <div className="inquiry-property">
                            🏠 {inq.properties?.title || 'General Property Inquiry'}
                          </div>
                          <p className="inquiry-msg">{inq.message}</p>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, display: 'flex', gap: 10 }}>
                            <span>📧 {inq.email}</span>
                            {inq.phone && <span>📞 {inq.phone}</span>}
                          </div>
                        </div>
                      ))}

                      {inquiries.length === 0 && (
                        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No inquiries found in database. Submit the booking contact forms to create entries.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Developer Actions */}
              <div>
                <h4 style={{ margin: '0 0 12px 0' }}>Developer Actions</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <button 
                    className="primary-btn" 
                    onClick={() => { setShowAddPropertyModal(true); setShowDevConsole(false); }}
                    style={{ fontSize: 12, padding: '10px 14px' }}
                  >
                    <Plus size={14} /> Add Property Row
                  </button>
                  <button 
                    className="secondary-btn" 
                    onClick={() => {
                      if(confirm("Generate new query diagnostics?")) {
                        checkConnectionAndFetch()
                      }
                    }}
                    style={{ fontSize: 12, padding: '10px 14px' }}
                  >
                    <Database size={14} /> Test DB Select
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ADD PROPERTY MODAL (DEVELOPER CONSOLE ACCESSIBLE) */}
      {showAddPropertyModal && (
        <div className="premium-modal-overlay" onClick={() => setShowAddPropertyModal(false)}>
          <div className="glass-card modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="listings-header" style={{ marginBottom: 20 }}>
              <h2 className="listings-title">Add Database Property Row</h2>
              <button onClick={() => setShowAddPropertyModal(false)} className="icon-btn">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddPropertySubmit}>
              <div className="form-group">
                <label className="form-label">Property Title *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Skyline Luxury Penthouse" 
                  value={newPropertyFormData.title}
                  onChange={(e) => setNewPropertyFormData({ ...newPropertyFormData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Block C, Treeivo" 
                  value={newPropertyFormData.location}
                  onChange={(e) => setNewPropertyFormData({ ...newPropertyFormData, location: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Price ($ Value) *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. 750000" 
                    value={newPropertyFormData.price}
                    onChange={(e) => setNewPropertyFormData({ ...newPropertyFormData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Area (Size) *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. 2,100 sqft"
                    value={newPropertyFormData.area}
                    onChange={(e) => setNewPropertyFormData({ ...newPropertyFormData, area: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div>
                  <label className="form-label">Beds</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min="0"
                    value={newPropertyFormData.beds}
                    onChange={(e) => setNewPropertyFormData({ ...newPropertyFormData, beds: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Baths</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    step="0.5" 
                    min="0"
                    value={newPropertyFormData.baths}
                    onChange={(e) => setNewPropertyFormData({ ...newPropertyFormData, baths: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Type</label>
                  <select 
                    className="form-select"
                    value={newPropertyFormData.type}
                    onChange={(e) => setNewPropertyFormData({ ...newPropertyFormData, type: e.target.value })}
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Property Image URL</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://images.unsplash.com/... (optional)"
                  value={newPropertyFormData.image_url}
                  onChange={(e) => setNewPropertyFormData({ ...newPropertyFormData, image_url: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" 
                  style={{ minHeight: 80, resize: 'vertical' }}
                  placeholder="Enter property narrative..."
                  value={newPropertyFormData.description}
                  onChange={(e) => setNewPropertyFormData({ ...newPropertyFormData, description: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, margin: '10px 0 20px 0' }}>
                <input 
                  type="checkbox" 
                  id="featured-check"
                  checked={newPropertyFormData.featured}
                  onChange={(e) => setNewPropertyFormData({ ...newPropertyFormData, featured: e.target.checked })}
                  style={{ width: 18, height: 18 }}
                />
                <label htmlFor="featured-check" style={{ fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Mark as Featured Listing</label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddPropertyModal(false)} className="secondary-btn">
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Synchronize Row
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
