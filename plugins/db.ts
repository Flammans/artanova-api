import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelAttributes,
  NonAttribute,
  Sequelize,
} from 'sequelize';

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class Artwork extends Model<
    InferAttributes<Artwork>,
    InferCreationAttributes<Artwork>
> {
  declare id: CreationOptional<number>;
  declare sourceName: string;
  declare sourceId: string;
  declare title: string;
  declare description: string | null;
  declare url: string | null;
  declare creditLine: string | null;
  declare date: string | null;
  declare origin: string | null;
  declare medium: string | null;
  declare images?: NonAttribute<Image[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class Image extends Model<
    InferAttributes<Image>,
    InferCreationAttributes<Image>
> {
  declare id: CreationOptional<number>;
  declare sourceId: string;
  declare artworkId: ForeignKey<Artwork['id']>;
  declare artwork: NonAttribute<Artwork>;
  declare urlPreview: string;
  declare urlFull: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export default defineNitroPlugin(async (nitro) => {
  const config = useRuntimeConfig();

  const sequelize = new Sequelize(config.databaseUrl);

  nitro.hooks.hookOnce('close', async () => {
    sequelize.close();
  });

  User.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    tableName: 'users',
    sequelize,
  });

  Artwork.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    sourceName: DataTypes.STRING,
    sourceId: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    url: DataTypes.STRING,
    creditLine: DataTypes.TEXT,
    date: DataTypes.STRING,
    origin: DataTypes.STRING,
    medium: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    tableName: 'artworks',
    sequelize,
  });

  Image.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    sourceId: DataTypes.STRING,
    urlPreview: DataTypes.STRING,
    urlFull: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    tableName: 'images',
    sequelize,
  });

  Artwork.hasMany(Image, {foreignKey: 'artworkId'});
  Image.belongsTo(Artwork, {foreignKey: 'artworkId'});

  await sequelize.query('PRAGMA foreign_keys = false;');
  await sequelize.sync({alter: true});
  await sequelize.query('PRAGMA foreign_keys = true;');
});
