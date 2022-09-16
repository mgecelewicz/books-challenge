module.exports = (sequelize, dataTypes) => {
    let alias = 'BooksAuthors';
    let cols = {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      AuthorId: {
        type: dataTypes.STRING,
        allowNull: false
      },
     BookId: {
      type: dataTypes.STRING,
      allowNull: false
    },
    };
    let config = {
      tableName: 'booksAuthors',
      timestamps: false,
    };
    
    const BooksAuthors = sequelize.define(alias, cols, config);
  
    BooksAuthors.associate = function (models) {
      BooksAuthors.belongsTo(models.Book, {
        as: 'book',
        foreingKey: 'BookId'
      });
    };

    BooksAuthors.associate = function (models) {
      BooksAuthors.belongsTo(models.Author, {
          as: 'author',
          foreingKey: 'AuthorId'
        });
      };

  
    return BooksAuthors;
  };
  