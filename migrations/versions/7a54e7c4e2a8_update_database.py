"""Update Database

Revision ID: 7a54e7c4e2a8
Revises: 
Create Date: 2023-12-29 14:14:13.523264

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7a54e7c4e2a8'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('office_supply', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image_url', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('image_name', sa.String(length=255), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('office_supply', schema=None) as batch_op:
        batch_op.drop_column('image_name')
        batch_op.drop_column('image_url')

    # ### end Alembic commands ###