// Function to handle navbar scrolling and menu toggle
$(document).ready(function () {
    $(window).on('scroll', () => {
        const $nav = $('.nav');
        const scrollPosition = $(document).scrollTop();
        $nav.toggleClass('affix', scrollPosition > 50);
        console.log("Scrolled more than 50 pixels");
    });

    $('.navTrigger').on('click', function () {
        $(this).toggleClass('active');
        console.log("Clicked menu");
        $('#mainListDiv').toggleClass('show_list').fadeIn();
    });
});
