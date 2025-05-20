// Database Interaction Patterns with Object-Relational Mapping (ORM)
// This file demonstrates various patterns for working with databases using ORMs
// with GitHub Copilot assistance

// Example using Sequelize ORM (Node.js)

const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Define models
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'moderator'),
    defaultValue: 'user'
  },
  lastLogin: {
    type: DataTypes.DATE
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  paranoid: true, // Soft deletes
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] },
    { fields: ['role', 'isActive'] }
  ]
});

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 200]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  publishedAt: {
    type: DataTypes.DATE
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['publishedAt'] }
  ]
});

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  timestamps: true
});

const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  timestamps: true
});

// Define relationships
User.hasMany(Post, { as: 'posts', foreignKey: 'authorId' });
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

Post.hasMany(Comment, { as: 'comments', foreignKey: 'postId' });
Comment.belongsTo(Post, { as: 'post', foreignKey: 'postId' });

User.hasMany(Comment, { as: 'comments', foreignKey: 'userId' });
Comment.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Post.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });
Category.hasMany(Post, { as: 'posts', foreignKey: 'categoryId' });

// Many-to-many relationship between Post and Tag
const PostTag = sequelize.define('PostTag', {}, { timestamps: false });
Post.belongsToMany(Tag, { through: PostTag });
Tag.belongsToMany(Post, { through: PostTag });

// Database interaction patterns examples

/**
 * Pattern: Repository Pattern
 * Encapsulates database operations for a specific model
 */
class UserRepository {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<User>} - Created user
   */
  async create(userData) {
    try {
      return await User.create(userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  /**
   * Find a user by ID
   * @param {string} id - User ID
   * @returns {Promise<User|null>} - Found user or null
   */
  async findById(id) {
    return await User.findByPk(id);
  }
  
  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Promise<User|null>} - Found user or null
   */
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }
  
  /**
   * Find users by role
   * @param {string} role - User role
   * @param {Object} options - Query options
   * @returns {Promise<Array<User>>} - Found users
   */
  async findByRole(role, options = {}) {
    const { page = 1, limit = 10, isActive = true } = options;
    const offset = (page - 1) * limit;
    
    return await User.findAndCountAll({
      where: { role, isActive },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
  }
  
  /**
   * Update a user
   * @param {string} id - User ID
   * @param {Object} updates - User updates
   * @returns {Promise<User|null>} - Updated user
   */
  async update(id, updates) {
    const [updated, users] = await User.update(updates, {
      where: { id },
      returning: true
    });
    
    return updated ? users[0] : null;
  }
  
  /**
   * Delete a user (soft delete)
   * @param {string} id - User ID
   * @returns {Promise<boolean>} - Success status
   */
  async delete(id) {
    const deleted = await User.destroy({
      where: { id }
    });
    
    return deleted > 0;
  }
  
  /**
   * Search users
   * @param {Object} criteria - Search criteria
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Users and count
   */
  async search(criteria, options = {}) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    
    if (criteria.username) {
      whereClause.username = { [Op.like]: `%${criteria.username}%` };
    }
    
    if (criteria.email) {
      whereClause.email = { [Op.like]: `%${criteria.email}%` };
    }
    
    if (criteria.role) {
      whereClause.role = criteria.role;
    }
    
    return await User.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
  }
}

/**
 * Pattern: Unit of Work
 * Coordinates transactions across multiple repositories
 */
class UnitOfWork {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.userRepository = new UserRepository();
    this.postRepository = null; // Add other repositories as needed
  }
  
  /**
   * Execute work within a transaction
   * @param {Function} work - Function containing the work to do
   * @returns {Promise<any>} - Result of the work
   */
  async executeInTransaction(work) {
    const t = await this.sequelize.transaction();
    
    try {
      const result = await work(t);
      await t.commit();
      return result;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

/**
 * Pattern: Query Builder
 * Builds complex queries with a fluent interface
 */
class PostQueryBuilder {
  constructor() {
    this.whereClause = {};
    this.includeModels = [];
    this.pagination = { page: 1, limit: 10 };
    this.ordering = [['createdAt', 'DESC']];
  }
  
  withStatus(status) {
    this.whereClause.status = status;
    return this;
  }
  
  withAuthor(authorId) {
    this.whereClause.authorId = authorId;
    return this;
  }
  
  withCategory(categoryId) {
    this.whereClause.categoryId = categoryId;
    return this;
  }
  
  publishedBetween(startDate, endDate) {
    this.whereClause.publishedAt = {
      [Op.between]: [startDate, endDate]
    };
    return this;
  }
  
  publishedAfter(date) {
    this.whereClause.publishedAt = {
      ...this.whereClause.publishedAt,
      [Op.gte]: date
    };
    return this;
  }
  
  withMinimumViews(count) {
    this.whereClause.viewCount = {
      [Op.gte]: count
    };
    return this;
  }
  
  withAuthorIncluded() {
    this.includeModels.push({
      model: User,
      as: 'author',
      attributes: ['id', 'username', 'email']
    });
    return this;
  }
  
  withCategoryIncluded() {
    this.includeModels.push({
      model: Category,
      as: 'category'
    });
    return this;
  }
  
  withCommentsIncluded(approvedOnly = true) {
    let include = {
      model: Comment,
      as: 'comments'
    };
    
    if (approvedOnly) {
      include.where = { isApproved: true };
    }
    
    this.includeModels.push(include);
    return this;
  }
  
  withTagsIncluded() {
    this.includeModels.push({
      model: Tag,
      through: { attributes: [] } // Exclude junction table
    });
    return this;
  }
  
  paginate(page, limit) {
    this.pagination = { page, limit };
    return this;
  }
  
  orderBy(field, direction = 'DESC') {
    this.ordering = [[field, direction]];
    return this;
  }
  
  async execute() {
    const { page, limit } = this.pagination;
    const offset = (page - 1) * limit;
    
    return await Post.findAndCountAll({
      where: this.whereClause,
      include: this.includeModels,
      limit,
      offset,
      order: this.ordering,
      distinct: true // Important for correct count with includes
    });
  }
}

/**
 * Pattern: Service Layer
 * Implements business logic using repositories
 */
class BlogService {
  constructor() {
    this.unitOfWork = new UnitOfWork(sequelize);
  }
  
  /**
   * Create a new blog post with tags
   * @param {Object} postData - Post data
   * @param {string[]} tagIds - Tag IDs
   * @returns {Promise<Post>} - Created post
   */
  async createPost(postData, tagIds = []) {
    return await this.unitOfWork.executeInTransaction(async (transaction) => {
      // Create the post
      const post = await Post.create(postData, { transaction });
      
      // Add tags if any
      if (tagIds.length > 0) {
        await post.setTags(tagIds, { transaction });
      }
      
      // Return the created post with its tags
      return await Post.findByPk(post.id, {
        include: [
          { model: Tag },
          { model: User, as: 'author' }
        ],
        transaction
      });
    });
  }
  
  /**
   * Publish a blog post
   * @param {string} postId - Post ID
   * @returns {Promise<Post>} - Updated post
   */
  async publishPost(postId) {
    return await this.unitOfWork.executeInTransaction(async (transaction) => {
      const post = await Post.findByPk(postId, { transaction });
      
      if (!post) {
        throw new Error(`Post with ID ${postId} not found`);
      }
      
      post.status = 'published';
      post.publishedAt = new Date();
      await post.save({ transaction });
      
      return post;
    });
  }
  
  /**
   * Add a comment to a post
   * @param {string} postId - Post ID
   * @param {string} userId - User ID
   * @param {string} content - Comment content
   * @param {boolean} autoApprove - Auto approve comment
   * @returns {Promise<Comment>} - Created comment
   */
  async addComment(postId, userId, content, autoApprove = false) {
    return await this.unitOfWork.executeInTransaction(async (transaction) => {
      // Check if post exists
      const post = await Post.findByPk(postId, { transaction });
      if (!post) {
        throw new Error(`Post with ID ${postId} not found`);
      }
      
      // Create comment
      const comment = await Comment.create({
        content,
        postId,
        userId,
        isApproved: autoApprove
      }, { transaction });
      
      return comment;
    });
  }
  
  /**
   * Get featured posts for homepage
   * @returns {Promise<Array<Post>>} - Featured posts
   */
  async getFeaturedPosts() {
    const queryBuilder = new PostQueryBuilder()
      .withStatus('published')
      .withMinimumViews(100)
      .withAuthorIncluded()
      .withCategoryIncluded()
      .orderBy('viewCount', 'DESC')
      .paginate(1, 5);
    
    const result = await queryBuilder.execute();
    return result.rows;
  }
  
  /**
   * Search posts with advanced criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Object>} - Posts and count
   */
  async searchPosts(criteria) {
    const queryBuilder = new PostQueryBuilder()
      .withStatus('published')
      .withAuthorIncluded()
      .withCategoryIncluded();
    
    if (criteria.categoryId) {
      queryBuilder.withCategory(criteria.categoryId);
    }
    
    if (criteria.authorId) {
      queryBuilder.withAuthor(criteria.authorId);
    }
    
    if (criteria.startDate && criteria.endDate) {
      queryBuilder.publishedBetween(criteria.startDate, criteria.endDate);
    } else if (criteria.startDate) {
      queryBuilder.publishedAfter(criteria.startDate);
    }
    
    if (criteria.includeTags) {
      queryBuilder.withTagsIncluded();
    }
    
    if (criteria.includeComments) {
      queryBuilder.withCommentsIncluded(true);
    }
    
    queryBuilder.paginate(criteria.page || 1, criteria.limit || 10);
    
    if (criteria.orderBy) {
      queryBuilder.orderBy(criteria.orderBy, criteria.orderDirection || 'DESC');
    }
    
    return await queryBuilder.execute();
  }
}

// Example usage
async function exampleUsage() {
  // Initialize database connection
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Sync models with database (in development only)
    await sequelize.sync({ force: false });
    
    // Create user repository
    const userRepo = new UserRepository();
    
    // Create a new user
    const user = await userRepo.create({
      username: 'johndoe',
      email: 'john@example.com',
      password: 'hashedpassword123', // Should be properly hashed in real code
      role: 'admin'
    });
    console.log('User created:', user.id);
    
    // Create blog service
    const blogService = new BlogService();
    
    // Create a blog post with tags
    const post = await blogService.createPost({
      title: 'Understanding ORMs',
      content: 'This is a detailed post about Object-Relational Mapping...',
      authorId: user.id
    }, ['tag1', 'tag2']);
    console.log('Post created:', post.id);
    
    // Publish the post
    await blogService.publishPost(post.id);
    console.log('Post published');
    
    // Search for posts
    const searchResults = await blogService.searchPosts({
      authorId: user.id,
      includeTags: true,
      includeComments: true,
      page: 1,
      limit: 10
    });
    console.log('Search results:', searchResults.count);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

// Uncomment to run example:
// exampleUsage();

module.exports = {
  sequelize,
  models: {
    User,
    Post,
    Comment,
    Category,
    Tag
  },
  repositories: {
    UserRepository
  },
  services: {
    BlogService
  },
  UnitOfWork,
  PostQueryBuilder
};