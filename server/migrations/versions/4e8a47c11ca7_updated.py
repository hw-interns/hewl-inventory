"""updated

Revision ID: 4e8a47c11ca7
Revises: 461cda0f67ec
Create Date: 2024-05-20 12:12:20.581124

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4e8a47c11ca7'
down_revision = '461cda0f67ec'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('office_supply', schema=None) as batch_op:
        batch_op.alter_column('description',
               existing_type=sa.TEXT(),
               type_=sa.String(length=120),
               existing_nullable=True)
        batch_op.alter_column('links',
               existing_type=sa.TEXT(),
               type_=sa.String(length=120),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('office_supply', schema=None) as batch_op:
        batch_op.alter_column('links',
               existing_type=sa.String(length=120),
               type_=sa.TEXT(),
               existing_nullable=True)
        batch_op.alter_column('description',
               existing_type=sa.String(length=120),
               type_=sa.TEXT(),
               existing_nullable=True)

    # ### end Alembic commands ###
