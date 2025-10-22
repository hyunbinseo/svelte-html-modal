export const showModalScript = `<script>(${() => {
	const dialog = document.currentScript?.previousElementSibling;
	if (!(dialog instanceof HTMLDialogElement)) return;
	document.body.style.overflow = 'hidden';
	dialog.showModal();
	document.currentScript?.remove();
}})()</script>`;
