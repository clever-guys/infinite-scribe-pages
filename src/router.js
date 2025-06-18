document.addEventListener('alpine:init', () => {
  Alpine.store('appState', {
    currentView: 'index', // Initialize with a default view
    showTagModal: false,
    selectedTagForModal: null,
    toasts: [],
    nextToastId: 0,
    showToast(message, duration = 3000) {
      const id = this.nextToastId++;
      this.toasts.push({ id, message, visible: true });
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    },
    removeToast(id) {
      const toastIndex = this.toasts.findIndex(t => t.id === id);
      if (toastIndex > -1) {
        this.toasts[toastIndex].visible = false;
        // Optional: actually remove from array after transition
        setTimeout(() => {
          this.toasts.splice(toastIndex, 1);
        }, 500); // Should match leave transition duration in HTML
      }
    }
  });

  function updateView() {
    const hash = window.location.hash.replace(/^#\/?/, '') || 'index'; // Normalize hash
    let view = '404'; // Default to not found page

    if (hash === 'index' || hash === '') {
      view = 'index';
    } else if (hash === 'mindmap') {
      view = 'mindmap';
    }
    // Add more routes here as needed:
    // else if (hash === 'some_other_page') {
    //   view = 'some_other_page';
    // }

    Alpine.store('appState').currentView = view;
  }

  // Listen for hash changes and update the view
  window.addEventListener('hashchange', updateView);

  // Update the view on initial page load
  // This needs to run after Alpine has initialized the store,
  // so it's placed within alpine:init.
  updateView();
});
