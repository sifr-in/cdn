(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);
//   document.getElementById("inquiryForm").addEventListener("submit", function(e) {
//     e.preventDefault();
//     alert("Thank you for contacting Swami's Sambar! We'll reach out to you shortly.");
//     this.reset();
//   });
// document.getElementById("inquiryForm").addEventListener("submit", function (e) {
//     e.preventDefault();
//     const name = document.getElementById("name").value;
//     const mobile = document.getElementById("mobile").value;
//     const email = document.getElementById("email").value;
//     const city = document.getElementById("city").value;
//     const message = document.getElementById("message").value;

    
//     const whatsappMessage = `Hello, I am ${name} from ${city}. My WhatsApp number is ${mobile}. My email is ${email}. Inquiry message: ${message}`;
//     const encodedMessage = encodeURIComponent(whatsappMessage);
//     const whatsappURL = `https://wa.me/919373989901?text=${encodedMessage}`;

//     window.open(whatsappURL, "_blank");
//   });

//   const videoModal = document.getElementById('videoModal');
//   videoModal.addEventListener('show.bs.modal', function (event) {
//     const button = event.relatedTarget;
//     const videoSrc = button.getAttribute('data-src');
//     const iframe = document.getElementById('video');
//     iframe.src = videoSrc + "?autoplay=1&modestbranding=1&showinfo=0";
//   });

//   function stopVideo() {
//     document.getElementById('video').src = '';
//   }

document.addEventListener('DOMContentLoaded', function () {
    const inquiryForm = document.getElementById('inquiryForm');
  
    inquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      // Get form values
      const name = document.getElementById('name').value.trim();
      const mobile = document.getElementById('mobile').value.trim();
      const city = document.getElementById('city').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
  
      // Validate fields
      if (name && mobile && city && email && message) {
        const confirmSubmit = confirm("Submitted now?");
  
        if (confirmSubmit) {
          const whatsappMessage = `Hello, I am ${name} from ${city}. My WhatsApp number is ${mobile}. My email is ${email}. Inquiry message: ${message}`;
          const encodedMessage = encodeURIComponent(whatsappMessage);
          const whatsappURL = `https://wa.me/918010577940?text=${encodedMessage}`;
  
          // Open WhatsApp with prefilled message
          window.open(whatsappURL, "_blank");
        } else {
          console.log("User cancelled submission.");
        }
      } else {
        alert('Please fill all the fields.');
      }
    });
  });
  const w_a_floating_lnk = document.getElementById("wa_floating_lnk");

w_a_floating_lnk.href =
  "https://api.whatsapp.com/send?phone=918010577940&amp;text=i%20am%20here%20from%20www.swami.in%20website.";
  
  