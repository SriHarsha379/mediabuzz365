const footer = document.querySelector("footer");

if(footer){
footer.innerHTML = `
<div class="footer-inner">

  <div>
    <h4>Media Buzz 365</h4>
    <p>Your trusted source for Telugu news</p>
  </div>

  <div>
    <h4>Quick Links</h4>
    <a href="about.html">About</a>
    <a href="contact.html">Contact</a>
    <a href="advertise.html">Advertise</a>
    <a href="privacy.html">Privacy Policy</a>
  </div>

  <div>
    <h4>Categories</h4>
    <a href="category.html?category=politics">Politics</a>
    <a href="category.html?category=sports">Sports</a>
    <a href="category.html?category=cinema">Cinema</a>
    <a href="category.html?category=business">Business</a>
  </div>

  <div>
    <h4>Connect With Us</h4>
    <div class="footer-social">
      <a href="https://www.facebook.com/share/16yj95q7u1/" target="_blank">
        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook">
      </a>
      <a href="https://www.instagram.com/mediabuzz365?igsh=MWNiemd6dWNhdmFwaQ==" target="_blank">
        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram">
      </a>
      <a href="https://www.youtube.com/@mediabuzz365" target="_blank">
        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg" alt="YouTube">
      </a>
      <a href="https://wa.me/919553770077" target="_blank">
        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" alt="WhatsApp">
      </a>
    </div>
  </div>

</div>

<div class="contact-card">
  📧 Email: info@mediabuzz365.in
</div>

<div class="copyright">
  © 2025 DHAATRI MEDIA BROADCAST PRIVATE LIMITED - All Rights Reserved
</div>
`;
}