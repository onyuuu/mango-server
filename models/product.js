module.exports = (sequelize, DataTypes) => {
    const product = sequelize.define('Product', {
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,  //이름은 무조건 쓰게 하기
        },
        price: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
        },
        seller: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(300),
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING(300),
            allowNull: true,
        },
        soldout: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: 0,   // 0 거짓, 1 참(soldout)
        }
    });
    return product;
}