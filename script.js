/*
 * Jali Ecosystems Limited - JavaScript
 * Artnation Group Style Inspired
 * Vertical Reveal Animations
 * Smooth Page Transitions
 */

/* Wait for DOM to load */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize vertical reveal animations
  initRevealAnimations();
  
  // Initialize navigation highlights
  initNavHighlights();
  
  // Smooth scroll for anchor links
  initSmoothScroll();
  
  // Initialize floating WhatsApp FAB
  initFloatyFAB();
  
  // Initialize chatbot
  initChatbot();
  
  // Initialize achievement counter animation
  initAchievementCounters();
});

/*
 * Vertical Reveal Animations
 * Elements reveal from bottom as user scrolls
 */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.section-content > div, .achievement-card, .contact-card, .partner-card');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });
}

/*
 * Navigation Highlight
 * Highlight the active section based on scroll position
 */
function initNavHighlights() {
  const sections = document.querySelectorAll('.page-section, #about, #partners');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  const highlightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          if (entry.isIntersecting) {
            link.classList.add('active');
          }
        }
      });
    });
  }, {
    threshold: 0.5
  });
  
  sections.forEach(section => {
    highlightObserver.observe(section);
  });
  
  // Also handle hash navigation on load
  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash) {
          link.classList.add('active');
        }
      });
    }, 100);
  }
}

/*
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/*
 * Floating Action Button (WhatsApp FAB)
 */
function initFloatyFAB() {
  const fab = document.querySelector('.fab');
  if (!fab) return;
  
  // Track scroll position
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Show FAB when scrolling down, hide when scrolling up
    if (currentScroll > lastScroll && currentScroll > 300) {
      fab.classList.add('visible');
    } else {
      fab.classList.remove('visible');
    }
    
    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
  }, { passive: true });
}

/*
 * Achievement Counter Animation
 * Animates numbers when they come into view (artnation style)
 */
function initAchievementCounters() {
  const counters = document.querySelectorAll('.achievement-number');
  
  if (counters.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.textContent);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });
  
  counters.forEach(counter => {
    const target = parseInt(counter.textContent);
    observer.observe(counter);
  });
}

function animateCounter(element, target) {
  const duration = 1500;
  const start = parseInt(element.textContent) || 0;
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const eased = 1 - Math.pow(1 - progress, 3);
    
    const current = Math.floor(start + (target - start) * eased);
    element.textContent = current + '+';
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }
  
  requestAnimationFrame(updateCounter);
}

/*
 * Offline Chatbot - Works without backend
 * Rule-based with predefined responses
 */
function initChatbot() {
  const chatbotContainer = document.createElement('div');
  chatbotContainer.className = 'chatbot-container';
  chatbotContainer.innerHTML = `
    <div class="chatbot-header">
      <span class="chatbot-title">Jali Assistant</span>
      <button class="chatbot-close" aria-label="Close chatbot">&times;</button>
    </div>
    <div class="chatbot-messages" id="chatbot-messages"></div>
    <div class="chatbot-input">
      <input type="text" id="chatbot-input" placeholder="Ask me about Jali Ecosystems..." />
      <button class="chatbot-send" aria-label="Send message">Send</button>
    </div>
  `;
  
  const body = document.body;
  body.insertBefore(chatbotContainer, footer);
  
  const messagesContainer = document.getElementById('chatbot-messages');
  const inputField = document.getElementById('chatbot-input');
  const sendButton = document.querySelector('.chatbot-send');
  const closeButton = document.querySelector('.chatbot-close');
  
  // Chatbot knowledge base - offline, no backend needed
  const knowledgeBase = {
    greetings: ['hello', 'hi', 'hey', 'hola', 'good morning', 'good afternoon'],
    services: ['asbestos', 'roofing', 'civil engineering', 'environmental', 'agroforestry', 'water'],
    about: ['who are you', 'what do you do', 'company', 'jali ecosystems'],
    contact: ['contact', 'phone', 'email', 'address', 'location'],
    partners: ['partners', 'clients', 'references'],
    privacy: ['privacy', 'policy'],
    goodbye: ['bye', 'goodbye', 'see you', 'farewell']
  };
  
  // Store conversation history for context
  let conversationHistory = [];
  
  // Render a message to the chat
  function renderMessage(message, isUser = false) {
    const div = document.createElement('div');
    div.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    div.innerHTML = `<p>${message}</p>`;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Get bot response based on user input
  function getBotResponse(userInput) {
    const input = userInput.toLowerCase().trim();
    
    // Check against knowledge base
    if (knowledgeBase.greetings.some(word => input.includes(word))) {
      return 'Hello! I\'m Jali Assistant, your guide to Jali Ecosystems Limited. How can I help you today?';
    }
    
    if (knowledgeBase.services.some(word => input.includes(word))) {
      if (input.includes('asbestos')) {
        return 'We specialize in safe, ethical asbestos removal and disposal with a NEMA licensed landfill in Murang\'a County. Our trained professionals follow NEMA guidelines and OSHA 2007 safety standards.';
      }
      if (input.includes('roofing') || input.includes('roof')) {
        return 'We provide high-quality roofing solutions including supply and installation of roofing materials, energy-efficient eco-friendly systems, roof repairs, maintenance, and waterproofing for residential, commercial, and industrial properties. We specialize in commercial roofing and warehouse frames.';
      }
      if (input.includes('civil') || input.includes('engineering')) {
        return 'Our civil engineering services include road maintenance, structural engineering and foundation work, drainage systems, and water management solutions. We ensure adherence to industry standards and local building codes. Our structural steel fabrication spans 42 counties.';
      }
      if (input.includes('environmental')) {
        return 'We offer sustainable environmental management practices, waste management including safe removal of hazardous Asbestos Containing Material (ACM) and recycling solutions, soil erosion control, and green infrastructure development.';
      }
      if (input.includes('agroforestry')) {
        return 'In partnership with KEFRI, we implement integrated agroforestry systems at Kibwezi using melia volkensii, nitrogen-fixing legumes, and pasture crops to promote ecological resilience, economic growth, and social empowerment for smallholder farmers.';
      }
      if (input.includes('water')) {
        return 'We provide sustainable water management solutions including drainage system design, water harvesting and storage, and wastewater treatment aligned with environmental responsibility and regulatory compliance.';
      }
      return 'We offer innovative engineering solutions in roofing, civil works, and environmental management, contributing to Kenya\'s infrastructural growth while ensuring environmental responsibility.';
    }
    
    if (knowledgeBase.about.some(word => input.includes(word))) {
      return 'Jali Ecosystems Limited is an innovative engineering firm offering roofing solutions, civil works, and environmental services. We have over 15 years of expertise in delivering high-quality, sustainable infrastructure across Kenya, with a focus on ecological resilience and customer satisfaction. We serve 42 counties with over 0+ completed projects and 100% client satisfaction.';
    }
    
    if (knowledgeBase.contact.some(word => input.includes(word))) {
      return 'You can reach us at info@jaliecosystems.co.ke or +254 724 540090 / +254 734 975411. Our office is at P.O. Box 44636–00100 GPO, NAIROBI, Vision Plaza, Third floor, Suite A15, Mombasa Road. We also have a WhatsApp chat button on the website!';
    }
    
    if (knowledgeBase.partners.some(word => input.includes(word))) {
      return 'We have partnered with diverse clients including CFAO/KVM (Thika), Kevian Kenya Limited, Voi Town Lodge, Mantrac Kenya Limited (Nairobi and Mombasa), St. Patrick Catholic Church (Thika), Kileleshwa Covenant Community Church (Nairobi), and Wood Products (Industrial Area).';
    }
    
    if (knowledgeBase.privacy.some(word => input.includes(word))) {
      return 'Our Privacy Policy explains how we collect, use, and safeguard your information. We respect your privacy and only collect personal data voluntarily provided through our contact forms and usage data to improve our services.';
    }
    
    if (knowledgeBase.goodbye.some(word => input.includes(word))) {
      return 'Goodbye! Feel free to reach out anytime via the contact details on our website. Have a great day!';
    }
    
    // Default fallback response
    return 'I\'m here to help with information about Jali Ecosystems Limited\'s services, including asbestos removal, roofing, civil engineering, environmental management, and agroforestry. You can also ask about our contact details or partners. What would you like to know?';
  }
  
  // Send message function
  function sendMessage() {
    const userText = inputField.value.trim();
    if (!userText) return;
    
    // Render user message
    renderMessage(userText, true);
    
    // Clear input
    inputField.value = '';
    
    // Get bot response (with slight delay for UX)
    const response = getBotResponse(userText);
    
    setTimeout(() => {
      renderMessage(response, false);
    }, 500);
  }
  
  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  closeButton.addEventListener('click', () => {
    chatbotContainer.style.display = 'none';
  });
  
  // Close on overlay click
  chatbotContainer.addEventListener('click', (e) => {
    if (e.target === chatbotContainer) {
      chatbotContainer.style.display = 'none';
    }
  });
  
  // Initial greeting after a short delay
  setTimeout(() => {
    if (messagesContainer.children.length === 0) {
      renderMessage('Hello! I\'m Jali Assistant. Ask me about our asbestos removal, roofing solutions, civil engineering, environmental services, or agroforestry projects. I can also help with our 15+ years experience across 42 counties!');
    }
  }, 500);
}