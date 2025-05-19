from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Literal
import sqlalchemy
import databases
import os
from dotenv import load_dotenv

load_dotenv()

# DB URL 구성
from urllib.parse import quote_plus
password = quote_plus()

DATABASE_URL = (
    f"mysql+aiomysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@"
    f"{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/skala"
)

database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

# customer 테이블 정의
customer = sqlalchemy.Table(
    "customer",
    metadata,
    sqlalchemy.Column("customer_id", sqlalchemy.Integer, primary_key=True, autoincrement=True),
    sqlalchemy.Column("name", sqlalchemy.String(50), nullable=False),
    sqlalchemy.Column("gender", sqlalchemy.CHAR(1), nullable=False),
    sqlalchemy.Column("age", sqlalchemy.Integer, nullable=False),
    sqlalchemy.Column("married", sqlalchemy.CHAR(1), nullable=False),
    sqlalchemy.Column("address", sqlalchemy.String(255), nullable=False),
    sqlalchemy.Column("address_detail", sqlalchemy.String(255)),
    sqlalchemy.Column("phone", sqlalchemy.String(13), nullable=False),
    sqlalchemy.Column("occupation", sqlalchemy.Enum(
        '공무원', '교사', '대학생', '대학원생',
        '자영업자', '주부', '프리랜서', '회사원', '기타'
    ), nullable=False),
    sqlalchemy.Column("income_range", sqlalchemy.Enum(
        '1,000만원 이하', '1,000~2,000만원', '2,000~3,000만원',
        '3,000~4,000만원', '4,000~5,000만원', '5,000만원 이상'
    ), nullable=False),
    sqlalchemy.Column("insurance_count", sqlalchemy.Integer, default=0),
    sqlalchemy.Column("created_at", sqlalchemy.TIMESTAMP, server_default=sqlalchemy.func.current_timestamp()),
    schema="skala"
)

router = APIRouter()


# 공통 모델
class CustomerBase(BaseModel):
    name: str
    gender: Literal["M", "F"]
    age: int = Field(..., ge=0, le=120)
    married: Literal["Y", "N"]
    address: str
    address_detail: Optional[str] = None
    phone: str  # 전체 번호
    occupation: Literal["공무원", "교사", "대학생", "대학원생", "자영업자", "주부", "프리랜서", "회사원", "기타"]
    income_range: Literal[
        "1,000만원 이하", "1,000~2,000만원", "2,000~3,000만원",
        "3,000~4,000만원", "4,000~5,000만원", "5,000만원 이상"
    ]
    insurance_count: Optional[int] = 0

class CustomerUpdate(CustomerBase):
    pass


@router.post("/")
async def create_customer(new_customer: CustomerBase):
    await database.connect()
    try:
        query = customer.insert().values(**new_customer.dict())
        last_id = await database.execute(query)
        return {"customer_id": last_id}
    finally:
        await database.disconnect()


# 조회: 이름 + 전화번호 뒷자리
@router.get("/")
async def get_customer(name: str, phone_suffix: str):
    await database.connect()
    try:
        query = customer.select().where(
            customer.c.name == name,
            sqlalchemy.func.right(customer.c.phone, 4) == phone_suffix
        )
        result = await database.fetch_all(query)
        if not result:
            raise HTTPException(status_code=404, detail="Customer not found")
        return result
    finally:
        await database.disconnect()


# 수정
@router.put("/{customer_id}")
async def update_customer(customer_id: int, updated: CustomerUpdate):
    await database.connect()
    try:
        query = customer.select().where(customer.c.customer_id == customer_id)
        exist = await database.fetch_one(query)
        if not exist:
            raise HTTPException(status_code=404, detail="Customer not found")

        update_query = customer.update().where(customer.c.customer_id == customer_id).values(**updated.dict())
        await database.execute(update_query)
        return {"message": "Customer updated"}
    finally:
        await database.disconnect()
