<template>
  <header>
    <img src="/src/assets/BSI_Logo.png" height="50" />
    <nav>
      <ul>
        <li>
          <RouterLink to="/" class="nav-btn">Accueil</RouterLink>
          <RouterLink to="/stats" class="nav-btn">Stats</RouterLink>
          <RouterLink to="/wishlist" class="nav-btn">Listes</RouterLink>
          <RouterLink to="/about" class="nav-btn">A propos</RouterLink>
        </li>
      </ul>
    </nav>
    <div class="right-actions">
      <div class="lang-switch">
        <span class="lang active">fr</span>
        <span class="separator">|</span>
        <span class="lang">en</span>
      </div>
      <div class="profile-menu">
        <svg
          class="profile-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 20.2C9.5 20.2 7.29 18.92 6 16.98C6.03 14.99 10 13.9 12 13.9C13.99 13.9 17.97 14.99 18 16.98C16.71 18.92 14.5 20.2 12 20.2Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  </header>
</template>
<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4rem;
  padding: 1rem 2rem;
  background-color: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  background-color: #5d5b4e;
}

.search-form {
  display: flex;
  align-items: center;
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 50px;
  padding: 0.3rem 0.5rem 0.3rem 1.2rem;
  width: 600px;
  transition: border-color 0.2s;
  background-color: #dfe2db;
}

.search-form:focus-within {
  border-color: var(--color-text);
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  color: var(--color-text);
  flex-grow: 1;
  font-size: 0.95rem;
}

.search-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.2rem 0.5rem;
  display: flex;
  align-items: center;
}

nav {
  margin: 0 auto;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  display: flex;
  gap: 2.5rem;
}

.nav-btn {
  text-decoration: none;
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  transition: all 0.2s ease;
  display: inline-block;
  background-color: #dfe2db;
}

.nav-btn:hover {
  color: rgb(255, 0, 0);
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.lang {
  cursor: pointer;
  transition: color 0.2s;
  text-transform: uppercase;
  font-size: 0.9rem;
  color: #000;
}

.lang:hover {
  color: rgb(255, 255, 255);
}

.lang.active {
  font-weight: bold;
  color: rgb(255, 255, 255);
}

.separator {
  color: var(--color-border-hover);
  cursor: default;
  color: black;
}

.profile-menu {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.profile-icon {
  width: 45px;
  height: 45px;
  color: var(--color-text);
  transition: color 0.2s ease;
  color: #131212;
}

.profile-icon:hover {
  color: rgb(255, 255, 255);
}

.search-input::-webkit-search-cancel-button {
  cursor: pointer;
  transform: scale(1.5);
}

.map-layout {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

.map-container {
  flex-grow: 1;
  height: 100%;
}

.side-panel {
  width: 30vw;
  min-width: 300px;
  padding: 16px;
  border-left: 1px solid var(--color-border);
  background-color: var(--color-background-soft);
  overflow-y: auto;
  font-family: sans-serif;
  color: var(--color-text);
}

.filter-box {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}

.filter-label {
  font-weight: bold;
}

.filter-select {
  width: 100%;
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
}

#info-panel {
  margin-top: 1rem;
}

.search-container {
  position: relative;
}

.suggestions-list {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.suggestions-list li {
  padding: 0.8rem 1.2rem;
  cursor: pointer;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.suggestions-list li:last-child {
  border-bottom: none;
}

:deep(.highlight-blue) {
  color: #007bff;
  font-weight: 500;
  display: inline;
}

.suggestions-list li:hover {
  background-color: var(--color-background-mute);
  font-weight: 900 !important;
}

.suggestions-list li:hover * {
  font-weight: 620 !important;
}

.suggestions-list li:hover :deep(.highlight-blue) {
  color: #007bff !important;
}

@media (max-width: 768px) {
  header {
    flex-wrap: wrap;
    padding: 0.5rem 1rem;
    gap: 0.5rem;
  }

  header > img {
    height: 28px;
  }

  .right-actions {
    margin-left: auto;
    gap: 1rem;
  }

  .search-container {
    order: 3;
    width: 100%;
    margin-top: 0.5rem;
  }

  .search-form {
    width: 100%;
  }

  nav {
    order: 4;
    width: 100%;
    margin-top: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  li {
    gap: 0.5rem;
  }

  .nav-btn {
    padding: 0.3rem 0.8rem;
    font-size: 0.85rem;
  }

  .map-layout {
    flex-direction: column;
  }

  .map-container {
    height: 65vh;
    flex-grow: 0;
  }

  .side-panel {
    width: 100%;
    min-width: 100%;
    height: auto;
    padding: 1rem;
    border-left: none;
    border-top: 1px solid var(--color-border);
  }
}
</style>
