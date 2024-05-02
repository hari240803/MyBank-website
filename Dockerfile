FROM node

WORKDIR /app
COPY run.sh .

COPY mybank-frontend ./mybank-frontend
COPY mybank-backend ./mybank-backend

RUN cd mybank-frontend && npm i
RUN cd mybank-backend && npm i

EXPOSE 3001
EXPOSE 3000

CMD ["./run.sh"]
