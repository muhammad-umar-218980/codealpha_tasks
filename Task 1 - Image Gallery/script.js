document.addEventListener('DOMContentLoaded', function () {
			const filterButtons = document.querySelectorAll('.filter-btn');
	const galleryItems = document.querySelectorAll('.gallery-item');

			filterButtons.forEach(button => {
		button.addEventListener('click', () => {
			filterButtons.forEach(btn => btn.classList.remove('active'));
			button.classList.add('active');

			const filter = button.getAttribute('data-filter');

			galleryItems.forEach(item => {
				if (filter === 'all' || item.getAttribute('data-category') === filter) {
					item.style.display = 'block';
					item.style.animation = 'fadeInUp 0.6s forwards';
				} else {
					item.style.display = 'none';
				}
			});
		});
			});

	const lightbox = document.querySelector('.lightbox');
	const lightboxImg = document.querySelector('.lightbox-img');
	const lightboxCaption = document.querySelector('.lightbox-caption');
	const closeBtn = document.querySelector('.close-btn');
	const prevBtn = document.querySelector('.prev-btn');
	const nextBtn = document.querySelector('.next-btn');

	let currentIndex = 0;
	const images = Array.from(galleryItems);

			galleryItems.forEach((item, index) => {
		item.addEventListener('click', () => {
			openLightbox(index);
		});
			});

	function openLightbox(index) {
		currentIndex = index;
	const imgSrc = images[index].querySelector('img').src;
	const caption = images[index].querySelector('.item-title').textContent;

	lightboxImg.src = imgSrc;
	lightboxCaption.textContent = caption;
	lightbox.classList.add('active');
	document.body.style.overflow = 'hidden';
			}

	function closeLightbox() {
		lightbox.classList.remove('active');
	document.body.style.overflow = 'auto';
			}

	function navigate(direction) {
				// Get only visible images based on current filter
				const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
				const visibleImages = images.filter(img =>
	activeFilter === 'all' || img.dataset.category === activeFilter
	);
	const currentVisibleIndex = visibleImages.indexOf(images[currentIndex]);

	let newIndex = currentVisibleIndex + direction;

	if (newIndex < 0) newIndex = visibleImages.length - 1;
				if (newIndex >= visibleImages.length) newIndex = 0;

	currentIndex = images.indexOf(visibleImages[newIndex]);
	openLightbox(currentIndex);
			}

	closeBtn.addEventListener('click', closeLightbox);
			prevBtn.addEventListener('click', () => navigate(-1));
			nextBtn.addEventListener('click', () => navigate(1));

			lightbox.addEventListener('click', (e) => {
				if (e.target === lightbox) {
		closeLightbox();
				}
			});

			document.addEventListener('keydown', (e) => {
				if (lightbox.classList.contains('active')) {
					if (e.key === 'Escape') {
		closeLightbox();
					} else if (e.key === 'ArrowLeft') {
		navigate(-1);
					} else if (e.key === 'ArrowRight') {
		navigate(1);
					}
				}
			});
});