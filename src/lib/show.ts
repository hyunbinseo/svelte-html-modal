export const showModalScript = `<script>(${() => {
	const dialog = document.currentScript?.previousElementSibling;
	if (!(dialog instanceof HTMLDialogElement)) return;
	dialog.showModal();
	document.currentScript?.remove();
}})()</script>`;
