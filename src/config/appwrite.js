export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
    frontendSkillsCollectionId: import.meta.env.VITE_APPWRITE_FRONTEND_SKILLS_COLLECTION_ID,
    backendSkillsCollectionId: import.meta.env.VITE_APPWRITE_BACKEND_SKILLS_COLLECTION_ID,
    softSkillsCollectionId: import.meta.env.VITE_APPWRITE_SOFT_SKILLS_COLLECTION_ID,
    projectsCollectionId: import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID,
};
